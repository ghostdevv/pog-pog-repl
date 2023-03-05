<script lang="ts">
    import Refresh from './controls/Refresh.svelte';
    import { file_tree } from '$lib/state';
    import Node from './Node.svelte';
</script>

<div class="fs">
    <div class="controls">
        <Refresh />
    </div>

    <div class="tree">
        {#each $file_tree as node (node.path)}
            <Node {node} />
        {/each}
    </div>
</div>

<style lang="scss">
    .fs {
        grid-area: fs;

        height: 100%;
        max-height: 100%;
        overflow-y: auto;

        min-width: 200px;

        border-right: 2px solid var(--background-secondary);

        .controls {
            background-color: var(--background-secondary);
            padding: 8px;
        }

        .tree {
            display: flex;
            flex-direction: column;
            align-items: stretch;

            padding: 8px;
        }

        .tree,
        .controls {
            color: rgba(var(--text-rgb), 0.8);
        }
    }
</style>
