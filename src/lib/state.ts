import type { WebContainer } from '@webcontainer/api';
import { writable } from 'svelte/store';
import { FileNode, read_file_tree } from './files';

export const file_tree = writable<FileNode[]>([]);

export async function refresh_state(container: WebContainer) {
    const files = await read_file_tree(container);
    file_tree.set(files);
}
