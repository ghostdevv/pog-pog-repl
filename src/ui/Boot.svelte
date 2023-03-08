<script lang="ts">
    import { WebContainer } from '@webcontainer/api';
    import { refresh_state } from '$lib/state';
    import { load_ppr } from '$lib/files';
    import Root from './Root.svelte';

    let container = load();

    async function load() {
        const params = new URLSearchParams(window.location.search);
        const container = await WebContainer.boot();

        const ppr = params.get('ppr');

        if (typeof ppr == 'string') {
            await load_ppr(container, atob(ppr));
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
