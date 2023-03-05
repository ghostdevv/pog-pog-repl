<script lang="ts">
    import { type FileNode, write_file_tree } from '$lib/files';
    import { get_container } from '$lib/container';
    import { refresh_state } from '$lib/state';

    let example: 'express' = 'express';

    const container = get_container();

    async function load() {
        let files: FileNode[] = [];

        switch (example) {
            case 'express': {
                ({ files } = await import('$lib/examples/express'));
            }
        }

        await write_file_tree(container, files);
        await refresh_state(container);

        console.log(`Loaded example fs "${example}"`);
    }
</script>

<div class="row">
    <label class="col">
        Load Example FS

        <select bind:value={example}>
            <option value="express">Express</option>
        </select>
    </label>

    <button on:click={load}>Load</button>
</div>

<style lang="scss">
    .row {
        align-items: flex-end;
    }
</style>
