import { type FSNode, read_fs_tree } from './files';
import type { WebContainer } from '@webcontainer/api';
import { writable } from 'svelte/store';

export const file_tree = writable<FSNode[]>([]);

export const selected_file_path = writable<string | null>(null);

export const changed_file_paths = writable<string[]>([]);

export async function refresh_state(container: WebContainer) {
    await sync_fs(container);

    // const currentSelectedFilePath = get(selected_file_path);

    // // Make sure the selected file actually exists
    // if (currentSelectedFilePath) {
    //     const foundNode = find_node_for_path(
    //         get(file_tree),
    //         currentSelectedFilePath,
    //     );

    //     if (!foundNode) {
    //         selected_file_path.set(null);
    //     }
    // }
}

export async function sync_fs(container: WebContainer) {
    const tree = await read_fs_tree(container);
    file_tree.set(tree);
}
