<script lang="ts">
    import { changed_file_paths, refresh_state } from '$lib/state';
    import { get_container } from '$lib/container';
    // import { write_file_tree } from '$lib/files';

    const container = get_container();

    // TODO update this
    async function save() {
        // await write_file_tree(container, $file_tree);
        $changed_file_paths = [];
        await refresh_state(container);

        console.log('saved all files');
    }
</script>

<button on:click={save}>Save All</button>
