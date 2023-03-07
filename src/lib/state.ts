import { type FSNode, read_fs_tree, flatten_tree, visit } from './files';
import { create_or_get_model, get_model } from './monaco';
import type { WebContainer } from '@webcontainer/api';
import { get, writable } from 'svelte/store';

export const file_tree = writable<FSNode[]>([]);

export const selected_file_path = writable<string | null>(null);

export const changed_file_paths = writable<string[]>([]);

export async function refresh_state(container: WebContainer) {
    await sync_fs(container);

    const current_selected_file_path = get(selected_file_path);
    const current_file_tree = get(file_tree);

    // Checks that node still exists
    if (current_selected_file_path) {
        let node: FSNode | null = null;

        visit(current_file_tree, (n) => {
            if (n.path == current_selected_file_path) {
                node = n;
            }
        });

        if (!node) {
            selected_file_path.set(null);

            const model = get_model(current_selected_file_path);

            console.log('Selected node no longer exists, deleting model');

            if (model) {
                model.dispose();
            }
        }
    }
}

export async function sync_fs(container: WebContainer) {
    const new_tree = await read_fs_tree(container);
    const current_tree = get(file_tree);

    const new_tree_paths = flatten_tree(new_tree)
        .filter((node) => node.type == 'FILE')
        .map((node) => node.path);

    const current_tree_paths = flatten_tree(current_tree)
        .filter((node) => node.type == 'FILE')
        .map((node) => node.path);

    for (const path of new_tree_paths) {
        if (!current_tree_paths.includes(path)) {
            await create_or_get_model(container, path);
        }
    }

    for (const path of current_tree_paths) {
        if (!new_tree_paths.includes(path)) {
            const model = get_model(path);

            console.log(`Disposing ${path}`);

            if (model) {
                model.dispose();
            }
        }
    }

    file_tree.set(new_tree);
}
