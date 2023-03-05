import { FSNode, find_node_for_path, read_file_tree, FileNode } from './files';
import type { WebContainer } from '@webcontainer/api';
import { derived, get, writable } from 'svelte/store';

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

        return null;
    },
);

export const changed_file_paths = writable<string[]>([]);

export async function refresh_state(container: WebContainer) {
    const files = await read_file_tree(container);
    file_tree.set(files);

    const currentSelectedFilePath = get(selected_file_path);

    // Make sure the selected file actually exists
    if (currentSelectedFilePath) {
        const foundNode = find_node_for_path(files, currentSelectedFilePath);

        if (!foundNode) {
            selected_file_path.set(null);
        }
    }
}
