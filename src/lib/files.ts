import type { WebContainer } from '@webcontainer/api';

export type JSONFSNode = JSONFileNode | JSONDirectoryNode;

export type JSONFileNode = Omit<FileNode, 'path'> & { contents: string };

export type JSONDirectoryNode = Omit<DirectoryNode, 'path' | 'children'> & {
    children: JSONFSNode[];
};

export type FSNode = FileNode | DirectoryNode;

export type FileNode = {
    type: 'FILE';
    name: string;
    path: string;
};

export type DirectoryNode = {
    type: 'DIRECTORY';
    name: string;
    path: string;
    children: FSNode[];
};

export interface PPRFile {
    data: JSONFSNode[];
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

// TODO ignore node_modules
// and anything in .gitignore
export async function read_json_fs_free(container: WebContainer, cwd = '.') {
    const files = await container.fs.readdir(cwd, { withFileTypes: true });
    const tree: JSONFSNode[] = [];

    for (const file of files) {
        const path = `${cwd}/${file.name}`;

        if (file.isDirectory()) {
            const children = await read_json_fs_free(container, path);
            tree.push({ type: 'DIRECTORY', name: file.name, children });
        } else {
            const contents = await container.fs.readFile(path, 'utf-8');
            tree.push({ type: 'FILE', name: file.name, contents });
        }
    }

    return tree;
}

export async function read_fs_tree(container: WebContainer, cwd = '.') {
    const files = await container.fs.readdir(cwd, { withFileTypes: true });
    const tree: FSNode[] = [];

    for (const file of files) {
        const path = `${cwd}/${file.name}`;

        if (file.isDirectory()) {
            const children = await read_fs_tree(container, path);
            tree.push({ type: 'DIRECTORY', path, name: file.name, children });
        } else {
            tree.push({ type: 'FILE', path, name: file.name });
        }
    }

    return tree;
}

export async function list_file_paths(container: WebContainer, cwd = '.') {
    const files = await container.fs.readdir(cwd, { withFileTypes: true });
    const paths: string[] = [];

    for (const file of files) {
        const path = `${cwd}/${file.name}`;

        if (file.isDirectory()) {
            const recPaths = await list_file_paths(container, path);
            paths.push(...recPaths);
        } else {
            paths.push(path);
        }
    }

    return paths;
}

export function visit(tree: FSNode[], cb: (node: FSNode) => void) {
    for (const node of tree) {
        cb(node);

        if (node.type == 'DIRECTORY') {
            visit(node.children, cb);
        }
    }
}

export function flatten_tree(tree: FSNode[]) {
    const nodes: FSNode[] = [];

    visit(tree, (node) => nodes.push(node));

    return nodes;
}

export async function load_ppr(container: WebContainer, raw: string) {
    const { data }: PPRFile = JSON.parse(raw);
    await write_json_fs_tree(container, data);
}
