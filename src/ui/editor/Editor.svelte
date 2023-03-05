<script lang="ts">
    import TSWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
    import HTMLWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
    import JSONWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
    import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
    import CSSWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
    import { selected_file_path, file_tree } from '$lib/state';
    import { FileNode, find_node_for_path } from '$lib/files';
    import { editor as monacoEditor } from 'monaco-editor';
    import type Monaco from 'monaco-editor';
    import { onMount } from 'svelte';

    let editor: Monaco.editor.IStandaloneCodeEditor;
    let element: HTMLDivElement;

    let selected_file_node: FileNode | null = null;

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

        editor = monacoEditor.create(element, {
            language: 'typescript',
            theme: 'vs-dark',
        });

        editor.onDidChangeModelContent(() => {
            if (selected_file_node) {
                const text = editor.getValue();
                selected_file_node.contents = text;
            }
        });

        return () => {
            editor.dispose();
        };
    });

    $: if ($selected_file_path && editor) {
        const node = find_node_for_path($file_tree, $selected_file_path);

        if (node && node instanceof FileNode) {
            selected_file_node = node;
            editor.setValue(node.contents);
        } else {
            selected_file_node = null;
            editor.setValue('');
        }
    }

    function resize() {
        editor.layout({ width: 0, height: 0 });

        requestAnimationFrame(() => {
            const rect = element.parentElement!.getBoundingClientRect();
            editor.layout({ width: rect.width, height: rect.height });
        });
    }

    function keydown(event: KeyboardEvent) {
        if (event.ctrlKey && event.key == 's') {
            event.preventDefault();

            if (selected_file_node) {
                selected_file_node.save();
            }
        }
    }
</script>

<svelte:window on:keydown={keydown} on:resize={resize} />

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
