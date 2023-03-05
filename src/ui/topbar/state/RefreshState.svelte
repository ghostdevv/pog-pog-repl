<script lang="ts">
    import { get_container } from '$lib/container';
    import { refresh_state } from '$lib/state';

    const container = get_container();

    async function refresh() {
        await refresh_state(container);
        console.log('refreshed state');
    }
</script>

<button on:click={refresh}>Refresh State</button>
