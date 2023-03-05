<script lang="ts">
    import TSWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
    import HTMLWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
    import JSONWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
    import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
    import CSSWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
    import { selected_file } from '$lib/state';
    import * as monaco from 'monaco-editor';
    import type Monaco from 'monaco-editor';
    import { onMount } from 'svelte';

    let editor: Monaco.editor.IStandaloneCodeEditor;
    let element: HTMLDivElement;

    let parentWidth: number;
    let parentHeight: number;

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
        });

        editor.onDidChangeModelContent(() => {
            const text = editor.getValue();
            const file = $selected_file;

            if (file) {
                file.contents = text;
            }
        });

        const interval = setInterval(() => {
            if ($selected_file && !$selected_file.contents_changed) {
                if ($selected_file.contents != editor.getValue()) {
                    editor.setValue($selected_file.contents);
                }
            }
        }, 1000);

        return () => {
            editor.dispose();
            clearInterval(interval);
        };
    });

    $: if ($selected_file && editor) {
        const uri = monaco.Uri.file($selected_file.path);
        const current_model = monaco.editor.getModel(uri);

        if (current_model) {
            editor.setModel(current_model);
        } else {
            const model = monaco.editor.createModel(
                $selected_file.contents,
                undefined,
                uri,
            );

            editor.setModel(model);
        }
    } else if (editor) {
        editor.setModel(null);
    }

    $: if (parentHeight || parentWidth) {
        editor.layout({ width: parentWidth || 0, height: parentHeight || 0 });
    }

    function keydown(event: KeyboardEvent) {
        if (event.ctrlKey && event.key == 's') {
            event.preventDefault();
            $selected_file?.save();
        }
    }
</script>

<svelte:window on:keydown={keydown} />

<div
    class="editor"
    bind:clientHeight={parentHeight}
    bind:clientWidth={parentWidth}>
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
