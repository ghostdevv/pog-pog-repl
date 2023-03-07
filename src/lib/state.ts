import type { WebContainer } from '@webcontainer/api';
import { derived, get, writable } from 'svelte/store';
import {
    FSNode,
    find_node_for_path,
    FileNode,
    visit,
    flatten_tree,
    list_file_paths_recursively,
    DirectoryNode,
} from './files';

export const file_tree = writable<FSNode[]>([]);

export const selected_file_path = writable<string | null>(null);

export const selected_file = derived(
    [selected_file_path, file_tree],
    ([path, tree]) => {
        if (!path || tree.length == 0) return null;

        const node = find_node_for_path(tree, path);

        if (node && node instanceof FileNode) {
            return node;
        }

        selected_file_path.set(null);

        return null;
    },
);

export const changed_file_paths = writable<string[]>([]);

export async function refresh_state(container: WebContainer) {
    await sync_fs(container);

    const currentSelectedFilePath = get(selected_file_path);

    // Make sure the selected file actually exists
    if (currentSelectedFilePath) {
        const foundNode = find_node_for_path(
            get(file_tree),
            currentSelectedFilePath,
        );

        if (!foundNode) {
            selected_file_path.set(null);
        }
    }
}

export async function sync_fs(container: WebContainer) {
    let tree_changed = false;
    let tree = get(file_tree);

    const current_paths = flatten_tree(tree)
        .filter((node) => node instanceof FileNode)
        .map((node) => node.path);

    const paths = await list_file_paths_recursively(container);

    for (const path of paths) {
        // If path is new
        if (!current_paths.includes(path)) {
            console.log('Adding synced node ', path);

            const pathSegments = path.replace('./', '').split('/');

            // Create the node
            const node = new FileNode({
                contents: await container.fs.readFile(path, 'utf-8'),
                name: pathSegments.at(-1)!,
                container,
                path,
            });

            // If the path has a parent, add to parent
            if (pathSegments.length > 1) {
                const parent_segments = pathSegments.slice(0, -1);

                const parent = find_node_for_path(
                    tree,
                    `./${parent_segments.join('/')}`,
                );

                if (parent && parent instanceof DirectoryNode) {
                    parent.children.push(node);
                }
            } else {
                // Otherwise add to tree root
                tree.push(node);
            }

            tree_changed = true;
        }
    }

    for (const path of current_paths) {
        // If path no longer exists remove it
        if (!paths.includes(path)) {
            console.log('Removing old node', path);

            const parent_path = path.split('/').slice(0, -1).join('/');
            const node = find_node_for_path(tree, parent_path);

            if (node && node instanceof DirectoryNode) {
                node.children = node.children.filter(
                    (child) => child.path != path,
                );
            } else {
                tree = tree.filter((child) => child.path != path);
            }

            tree_changed = true;
        }
    }

    if (tree_changed) {
        file_tree.set(tree);
    }

    visit(tree, (node) => {
        if (node instanceof FileNode) {
            node.sync_fs();
        }
    });
}
