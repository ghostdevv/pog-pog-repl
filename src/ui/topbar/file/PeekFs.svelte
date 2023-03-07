<script lang="ts">
    import { list_file_paths, read_fs_tree } from '$lib/files';
    import { get_container } from '$lib/container';

    const container = get_container();

    async function peek() {
        const paths = await list_file_paths(container);
        const tree = await read_fs_tree(container);

        console.log('peek fs command', { paths, tree });
    }
</script>

<button on:click={peek}>Peek FS</button>
