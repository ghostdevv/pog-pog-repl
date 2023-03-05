<script lang="ts">
    import type { WebContainer } from '@webcontainer/api';
    import { refresh_state, sync_fs } from '$lib/state';
    import Terminal from './terminal/Terminal.svelte';
    import { setContext, onMount } from 'svelte';
    import TopBar from './topbar/TopBar.svelte';
    import Editor from './editor/Editor.svelte';
    import Output from './output/Output.svelte';
    import Files from './files/Files.svelte';

    export let container: WebContainer;

    setContext('container', container);

    refresh_state(container);

    onMount(() => {
        const interval = setInterval(() => sync_fs(container), 2000);
        return () => clearInterval(interval);
    });

    // TODO
    // - tsconfig/jsconfig support
    // - npm modules intellisense support
</script>

<main>
    <TopBar />
    <Files />
    <Editor />
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
