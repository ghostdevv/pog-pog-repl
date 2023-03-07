<script lang="ts">
    import TSWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
    import HTMLWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
    import JSONWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
    import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
    import CSSWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
    import { changed_file_paths, selected_file_path } from '$lib/state';
    import { get_container } from '$lib/container';
    import * as monaco from 'monaco-editor';
    import type Monaco from 'monaco-editor';
    import { onMount } from 'svelte';

    let editor: Monaco.editor.IStandaloneCodeEditor;
    let element: HTMLDivElement;

    const container = get_container();

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    });

    onMount(async () => {
        self.MonacoEnvironment = {
            getWorker: function (_moduleId, label) {
                switch (label) {
                    case 'json':
                        return new JSONWorker();

                    case 'css':
                    case 'scss':
                        return new CSSWorker();

                    case 'html':
                        return new HTMLWorker();

                    case 'typescript':
                    case 'javascript':
                        return new TSWorker();

                    default:
                        return new EditorWorker();
                }
            },
        };

        editor = monaco.editor.create(element, {
            theme: 'vs-dark',
            automaticLayout: true,
        });

        const interval = setInterval(async () => {
            if ($selected_file_path) {
                if (!$changed_file_paths.includes($selected_file_path)) {
                    const contents = await container.fs.readFile(
                        $selected_file_path,
                        'utf-8',
                    );

                    if (editor.getValue() != contents) {
                        editor.setValue(contents);
                    }
                }
            }
        }, 2000);

        return () => {
            editor.dispose();
            clearInterval(interval);
        };
    });

    async function create_or_get_model(path: string) {
        const uri = monaco.Uri.file(path);
        const current_model = monaco.editor.getModel(uri);

        if (current_model) {
            editor.setModel(current_model);
        } else {
            const contents = await container.fs.readFile(path, 'utf-8');
            const model = monaco.editor.createModel(contents, undefined, uri);

            model.onDidChangeContent((event) => {
                console.log(`Content Changed: ${path}`);

                if (!$changed_file_paths.includes(path) && !event.isFlush) {
                    changed_file_paths.update((p) => [...p, path]);
                }
            });

            editor.setModel(model);
        }
    }

    $: if ($selected_file_path && editor) {
        create_or_get_model($selected_file_path);
    } else if (editor) {
        editor.setModel(null);
    }

    async function keydown(event: KeyboardEvent) {
        if (event.ctrlKey && event.key == 's' && $selected_file_path) {
            event.preventDefault();

            const path = $selected_file_path;
            await container.fs.writeFile(path, editor.getValue(), 'utf-8');

            if ($changed_file_paths.includes(path)) {
                changed_file_paths.update((p) => p.filter((x) => x != path));
            }
        }
    }
</script>

<svelte:window on:keydown={keydown} />

<div class="editor">
    <div bind:this={element} class="monaco" />
</div>

<style lang="scss">
    .monaco {
        height: 100%;
        width: 100%;
    }

    .editor {
        width: 100%;
        height: 100%;
        max-height: 100%;

        grid-area: editor;
    }
</style>
