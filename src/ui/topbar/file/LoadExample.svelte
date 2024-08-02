<script lang="ts">
    import { type JSONFSNode, write_json_fs_tree } from '$lib/files';
    import { get_container } from '$lib/container';
    import { refresh_state } from '$lib/state';

    let example: 'hono' | 'typescript' | 'svelte' = 'hono';

    const container = get_container();

    async function load() {
        let files: JSONFSNode[] = [];

        switch (example) {
            case 'hono': {
                ({ files } = await import('$lib/examples/hono'));
                break;
            }

            case 'typescript': {
                ({ files } = await import('$lib/examples/typescript'));
                break;
            }

            case 'svelte': {
                ({ files } = await import('$lib/examples/svelte'));
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
            <option value="svelte">Svelte</option>
            <option value="hono">Hono</option>
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
