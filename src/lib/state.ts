import { FileNode, find_node_for_path, read_file_tree } from './files';
import type { WebContainer } from '@webcontainer/api';
import { get, writable } from 'svelte/store';

export const file_tree = writable<FileNode[]>([]);

export const selected_file_path = writable<string | null>(null);

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
