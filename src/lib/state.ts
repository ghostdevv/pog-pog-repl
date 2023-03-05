import type { WebContainer } from '@webcontainer/api';
import { FileNode, read_file_tree } from './files';
import { writable } from 'svelte/store';

export const file_tree = writable<FileNode[]>([]);

export const selected_file_path = writable<string>();

export async function refresh_state(container: WebContainer) {
    const files = await read_file_tree(container);
    file_tree.set(files);
}
