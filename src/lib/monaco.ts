import type { WebContainer } from '@webcontainer/api';
import { changed_file_paths } from './state';
import * as monaco from 'monaco-editor';
import { get } from 'svelte/store';

export async function create_or_get_model(
    container: WebContainer,
    path: string,
) {
    const uri = new monaco.Uri().with({ path });
    const current_model = monaco.editor.getModel(uri);

    if (current_model) {
        console.log(`Found model: ${path}`);
        return current_model;
    }

    console.log(`Creating Model: ${path}`);

    const contents = await container.fs.readFile(path, 'utf-8');
    const model = monaco.editor.createModel(contents, undefined, uri);

    model.onDidChangeContent((event) => {
        console.log(`Content Changed: ${path}`);

        if (!get(changed_file_paths).includes(path) && !event.isFlush) {
            changed_file_paths.update((p) => [...p, path]);
        }
    });

    return model;
}

export function get_model(path: string) {
    const uri = new monaco.Uri().with({ path });
    const model = monaco.editor.getModel(uri);

    return model ? model : null;
}
