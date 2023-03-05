<script lang="ts">
    import { get_container } from '$lib/container';
    import { list_paths_recursively } from '$lib/files';

    const container = get_container();

    async function peek() {
        const paths = await list_paths_recursively(container);
        console.log('peek fs command', paths);
    }
</script>

<button on:click={peek}>Peek FS</button>
