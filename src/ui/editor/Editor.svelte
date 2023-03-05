<script lang="ts">
    import TSWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
    import HTMLWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
    import JSONWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
    import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
    import CSSWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
    import { editor as monacoEditor } from 'monaco-editor';
    import type Monaco from 'monaco-editor';
    import { onMount } from 'svelte';

    let editor: Monaco.editor.IStandaloneCodeEditor;
    let element: HTMLDivElement;

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
            value: '/* Loading... */',
            language: 'typescript',
            theme: 'vs-dark',
            readOnly: true,
        });

        editor.onDidChangeModelContent(() => {
            // const text = editor.getValue();
        });

        console.log(editor);

        return () => {
            editor.dispose();
        };
    });

    function resize() {
        editor.layout({ width: 0, height: 0 });

        requestAnimationFrame(() => {
            const rect = element.parentElement!.getBoundingClientRect();
            editor.layout({ width: rect.width, height: rect.height });
        });
    }
</script>

<svelte:window on:resize={resize} />

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
