import type { WebContainer } from '@webcontainer/api';

export type FileNode =
    | { type: 'FILE'; name: string; path: string; contents: string }
    | { type: 'DIRECTORY'; name: string; path: string; children: FileNode[] };

export async function write_file_tree(
    container: WebContainer,
    tree: FileNode[],
) {
    for (const node of tree) {
        if (node.type == 'FILE' && node.contents) {
            await container.fs.writeFile(node.path, node.contents, 'utf-8');
        }

        if (node.type == 'DIRECTORY') {
            await container.fs.mkdir(node.path, { recursive: true });
            await write_file_tree(container, node.children);
        }
    }
}

export async function read_file_tree(container: WebContainer, cwd = '.') {
    const files = await container.fs.readdir(cwd, { withFileTypes: true });
    const tree: FileNode[] = [];

    for (const file of files) {
        const path = `${cwd}/${file.name}`;

        if (file.isDirectory()) {
            const children = await read_file_tree(container, path);

            tree.push({
                type: 'DIRECTORY',
                name: file.name,
                children,
                path,
            });
        } else {
            const contents = await container.fs.readFile(path, 'utf-8');

            tree.push({
                type: 'FILE',
                name: file.name,
                contents,
                path,
            });
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
    tree: FileNode[],
    path: string,
): FileNode | null {
    for (const node of tree) {
        if (node.path == path) {
            return node;
        }

        if (node.type == 'DIRECTORY') {
            const result = find_node_for_path(node.children, path);

            if (result) {
                return result;
            }
        }
    }

    return null;
}
