<script lang="ts">
    import type { WebContainer } from '@webcontainer/api';
    import Terminal from './terminal/Terminal.svelte';
    import type { MonacoEditor } from '$lib/types';
    import { setContext, onMount } from 'svelte';
    import TopBar from './topbar/TopBar.svelte';
    import Editor from './editor/Editor.svelte';
    import Output from './output/Output.svelte';
    import { refresh_state } from '$lib/state';
    import Files from './files/Files.svelte';

    export let container: WebContainer;

    let editor: MonacoEditor | null;

    setContext('container', container);

    refresh_state(container);

    onMount(() => {
        const interval = setInterval(() => refresh_state(container), 2000);
        return () => clearInterval(interval);
    });

    // TODO
    // - tsconfig/jsconfig support
    // - npm modules intellisense support
</script>

<main>
    <TopBar />
    <Files />
    <Editor bind:editor />
    <Terminal />
    <Output />
</main>

<style lang="scss">
    main {
        display: grid;
        grid-template-columns: max-content 1fr 1fr;
        grid-template-rows: max-content 1fr max-content;
        grid-template-areas: 'topbar topbar topbar' 'fs editor output' 'fs terminal output';
        align-items: stretch;

        width: 100%;
        height: 100vh;
        max-height: 100vh;
    }
</style>
