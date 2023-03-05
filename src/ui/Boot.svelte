<script lang="ts">
    import { WebContainer } from '@webcontainer/api';
    import Root from './Root.svelte';

    let container = new Promise<WebContainer>(() => {});

    window.addEventListener('load', () => {
        container = WebContainer.boot();
    });
</script>

{#await container}
    LOADING
{:then container}
    <Root {container} />
{:catch error}
    Error {error}
{/await}
