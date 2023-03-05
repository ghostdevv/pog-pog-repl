<script lang="ts">
    import { changed_file_paths, selected_file_path } from '$lib/state';
    import { DirectoryNode, type FSNode } from '$lib/files';
    import Folder from './Folder.svelte';

    export let node: FSNode;
</script>

{#if node instanceof DirectoryNode}
    <Folder {node} />
{:else}
    <button
        class="item"
        class:selected={$selected_file_path == node.path}
        on:click={() => {
            $selected_file_path =
                $selected_file_path == node.path ? null : node.path;
        }}>
        {node.name}

        {#if $changed_file_paths.includes(node.path)}
            *
        {/if}
    </button>
{/if}

<style lang="scss">
    .item {
        all: unset;
        display: block;
        margin: 0px;

        display: flex;
        align-items: center;
        gap: 8px;

        padding: 4px 12px;
        cursor: pointer;

        border-right: 2px solid transparent;
        transition: border-color 0.2s ease-in-out;

        &:hover:not(.children:hover),
        &:focus:not(.children:focus),
        &.selected {
            background-color: var(--background-tertiary);
        }

        &.selected {
            border-color: var(--primary);
        }
    }
</style>
