import {
    FSNode,
    find_node_for_path,
    read_file_tree,
    FileNode,
    visit,
    flatten_tree,
} from './files';
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

        selected_file_path.set(null);

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

export async function sync_fs(container: WebContainer) {
    const new_tree = await read_file_tree(container);
    const current_tree = get(file_tree);

    const current_paths = flatten_tree(current_tree).map((node) => node.path);
    const new_paths = flatten_tree(new_tree).map((node) => node.path);

    if (current_paths.length != new_paths.length) {
        file_tree.set(new_tree);
        return;
    }

    if (current_paths.some((path) => !new_paths.includes(path))) {
        file_tree.set(new_tree);
        return;
    }

    visit(get(file_tree), (node) => {
        if (node instanceof FileNode) {
            node.sync_fs();
        }
    });
}
