<script lang="ts">
    import type { FileNode } from '$lib/files';
    import Folder from './Folder.svelte';

    export let node: FileNode;
</script>

{#if node.type == 'DIRECTORY'}
    <Folder {node} />
{:else}
    <div class="item">
        <p>{node.name}</p>
    </div>
{/if}

<style lang="scss">
    .item {
        padding: 4px 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;

        &:hover:not(.children:hover),
        &:focus:not(.children:focus),
        &.selected {
            background-color: var(--background-tertiary);
        }

        &.selected {
            border-right: 2px solid var(--primary);
        }
    }
</style>
