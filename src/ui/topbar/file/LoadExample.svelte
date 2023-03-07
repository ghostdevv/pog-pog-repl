<script lang="ts">
    import { type JSONFSNode, write_json_fs_tree } from '$lib/files';
    import { get_container } from '$lib/container';
    import { refresh_state } from '$lib/state';

    let example: 'express' | 'typescript' = 'express';

    const container = get_container();

    async function load() {
        let files: JSONFSNode[] = [];

        switch (example) {
            case 'express': {
                ({ files } = await import('$lib/examples/express'));
                break;
            }

            case 'typescript': {
                ({ files } = await import('$lib/examples/typescript'));
                break;
            }
        }

        await write_json_fs_tree(container, files);
        await refresh_state(container);

        console.log(`Loaded example fs "${example}"`);
    }
</script>

<div class="row">
    <label class="col">
        Load Example FS

        <select bind:value={example}>
            <option value="express">Express</option>
            <option value="typescript">TypeScript</option>
        </select>
    </label>

    <button class="secondary" on:click={load}>Load</button>
</div>

<style lang="scss">
    .row {
        align-items: flex-end;
    }
</style>
