<script lang="ts">
    import type { WebContainer } from '@webcontainer/api';
    import TopBar from './topbar/TopBar.svelte';
    import Editor from './editor/Editor.svelte';
    import Output from './output/Output.svelte';
    import { setContext } from 'svelte';

    export let container: WebContainer;

    setContext('container', container);

    import { files } from '$lib/examples/express';
    import { list_paths_recursively, load_file_tree } from '$lib/files';

    load_file_tree(container, files).then(async () => {
        const paths = await list_paths_recursively(container);
        console.log(paths);
    });
</script>

<main>
    <TopBar />
    <Editor />
    <Output />
</main>

<style lang="scss">
    main {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: max-content 1fr;
        grid-template-areas: 'topbar topbar' 'editor output';
        align-items: stretch;

        width: 100%;
        height: 100vh;
    }
</style>
