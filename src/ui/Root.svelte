<script lang="ts">
    import type { WebContainer } from '@webcontainer/api';
    import TopBar from './topbar/TopBar.svelte';
    import Editor from './editor/Editor.svelte';
    import Output from './output/Output.svelte';
    import { refresh_state } from '$lib/state';
    import { setContext } from 'svelte';
    import FS from './files/FS.svelte';

    export let container: WebContainer;

    setContext('container', container);

    refresh_state(container);
</script>

<main>
    <TopBar />
    <FS />
    <Editor />
    <Output />
</main>

<style lang="scss">
    main {
        display: grid;
        grid-template-columns: max-content 1fr 1fr;
        grid-template-rows: max-content 1fr;
        grid-template-areas: 'topbar topbar topbar' 'fs editor output';
        align-items: stretch;

        width: 100%;
        height: 100vh;
    }
</style>
