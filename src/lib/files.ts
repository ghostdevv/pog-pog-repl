import type { WebContainer } from '@webcontainer/api';
import { changed_file_paths } from './state';

export type JSONFSNode =
    | { type: 'FILE'; name: string; contents: string }
    | { type: 'DIRECTORY'; name: string; children: JSONFSNode[] };

export abstract class FSNode {
    constructor(public readonly name: string, public readonly path: string) {}
}

export class FileNode extends FSNode {
    private readonly container: WebContainer;

    private file_contents: string;
    private modified: boolean;

    constructor(options: {
        name: string;
        path: string;
        contents: string;
        container: WebContainer;
    }) {
        super(options.name, options.path);

        this.container = options.container;

        this.file_contents = options.contents;
        this.modified = false;
    }

    get contents_changed() {
        return this.modified;
    }

    get contents() {
        return this.file_contents;
    }

    set contents(new_contents: string) {
        if (this.file_contents == new_contents) return;

        this.file_contents = new_contents;

        if (!this.modified) {
            this.modified = true;
            changed_file_paths.update((paths) => [...paths, this.path]);
        }
    }

    async save() {
        if (this.modified) {
            this.container.fs.writeFile(this.path, this.file_contents, 'utf-8');

            this.modified = false;

            changed_file_paths.update((paths) =>
                paths.filter((p) => p != this.path),
            );
        }
    }

    async sync_fs() {
        if (!this.modified) {
            const fs_contents = await this.container.fs.readFile(
                this.path,
                'utf-8',
            );

            if (fs_contents != this.file_contents) {
                this.file_contents = fs_contents;
            }
        }
    }
}

export class DirectoryNode extends FSNode {
    public readonly children: FSNode[];

    constructor(options: { name: string; path: string; children: FSNode[] }) {
        super(options.name, options.path);
        this.children = options.children;
    }
}

export async function write_json_fs_tree(
    container: WebContainer,
    tree: JSONFSNode[],
    cwd = '.',
) {
    for (const node of tree) {
        const path = `${cwd}/${node.name}`;

        if (node.type == 'FILE' && node.contents) {
            await container.fs.writeFile(path, node.contents, 'utf-8');
        }

        if (node.type == 'DIRECTORY') {
            await container.fs.mkdir(path, { recursive: true });
            await write_json_fs_tree(container, node.children, path);
        }
    }
}

export async function read_file_tree(container: WebContainer, cwd = '.') {
    const files = await container.fs.readdir(cwd, { withFileTypes: true });
    const tree: FSNode[] = [];

    for (const file of files) {
        const path = `${cwd}/${file.name}`;

        if (file.isDirectory()) {
            const children = await read_file_tree(container, path);
            tree.push(new DirectoryNode({ name: file.name, path, children }));
        } else {
            const contents = await container.fs.readFile(path, 'utf-8');

            const node = new FileNode({
                name: file.name,
                contents,
                path,
                container,
            });

            tree.push(node);
        }
    }

    return tree;
}

export async function list_paths_recursively(
    container: WebContainer,
    cwd = '.',
) {
    const files = await container.fs.readdir(cwd, { withFileTypes: true });
    const paths: string[] = [];

    for (const file of files) {
        const path = `${cwd}/${file.name}`;

        if (file.isDirectory()) {
            const recPaths = await list_paths_recursively(container, path);
            paths.push(...recPaths);
        } else {
            paths.push(path);
        }
    }

    return paths;
}

export function find_node_for_path(
    tree: FSNode[],
    path: string,
): FSNode | null {
    let node: FSNode | null = null;

    visit(tree, (found) => {
        if (found.path == path) {
            node = found;
        }
    });

    return node;
}

export function visit(tree: FSNode[], cb: (node: FSNode) => void) {
    for (const node of tree) {
        cb(node);

        if (node instanceof DirectoryNode) {
            visit(node.children, cb);
        }
    }
}
