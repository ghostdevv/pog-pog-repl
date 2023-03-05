import type { WebContainer } from '@webcontainer/api';

export type FileNode =
    | { type: 'FILE'; name: string; contents: string }
    | { type: 'DIRECTORY'; name: string; children: FileNode[] };

export async function write_file_tree(
    container: WebContainer,
    tree: FileNode[],
    pathSegments: string[] = [],
) {
    for (const node of tree) {
        const path = pathSegments.join('/') + `/${node.name}`;

        if (node.type == 'FILE') {
            await container.fs.writeFile(path, node.contents, 'utf-8');
            continue;
        }

        await container.fs.mkdir(path, { recursive: true });

        await write_file_tree(container, node.children, [
            ...pathSegments,
            node.name,
        ]);
    }
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
