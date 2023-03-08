<script lang="ts">
    import { type PPRFile, write_json_fs_tree } from '$lib/files';
    import { WebContainer } from '@webcontainer/api';
    import { refresh_state } from '$lib/state';
    import Root from './Root.svelte';

    let container = load();

    async function load() {
        const params = new URLSearchParams(window.location.search);
        const container = await WebContainer.boot();

        const ppr = params.get('ppr');

        if (typeof ppr == 'string') {
            const { data }: PPRFile = JSON.parse(atob(ppr));
            await write_json_fs_tree(container, data);
        }

        await refresh_state(container);

        return container;
    }
</script>

{#await container}
    LOADING
{:then container}
    <Root {container} />
{:catch error}
    Error {error}
{/await}
