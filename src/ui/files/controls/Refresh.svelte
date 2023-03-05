<script lang="ts">
    import { faRefresh } from '@fortawesome/free-solid-svg-icons';
    import { get_container } from '$lib/container';
    import { sync_fs } from '$lib/state';
    import Fa from 'svelte-fa';

    let disabled = false;

    const container = get_container();

    async function refresh() {
        disabled = true;

        await sync_fs(container);

        disabled = false;
    }
</script>

<button class="icon" {disabled} on:click={refresh}>
    <Fa icon={faRefresh} />
</button>
