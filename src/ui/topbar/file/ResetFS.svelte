<script lang="ts">
    import { get_container } from '$lib/container';
    import { refresh_state } from '$lib/state';

    const container = get_container();

    async function reset() {
        const files = await container.fs.readdir('.');

        for (const file of files) {
            await container.fs.rm(file, { recursive: true, force: true });
        }

        await refresh_state(container);
    }
</script>

<button class="secondary" on:click={reset}>Reset REPL</button>
