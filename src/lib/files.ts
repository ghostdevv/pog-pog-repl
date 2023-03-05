import type { WebContainer } from '@webcontainer/api';

export type JSONFSNode =
    | { type: 'FILE'; name: string; contents: string }
    | { type: 'DIRECTORY'; name: string; children: JSONFSNode[] };

export abstract class FSNode {
    constructor(public readonly name: string, public readonly path: string) {}
}

export class FileNode extends FSNode {
    public readonly contents: string;

    constructor(options: { name: string; path: string; contents: string }) {
        super(options.name, options.path);
        this.contents = options.contents;
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
            tree.push(new FileNode({ name: file.name, contents, path }));
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
    for (const node of tree) {
        if (node.path == path) {
            return node;
        }

        if (node instanceof DirectoryNode) {
            const result = find_node_for_path(node.children, path);

            if (result) {
                return result;
            }
        }
    }

    return null;
}
