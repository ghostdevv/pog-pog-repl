<script lang="ts">
    import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
    import type { FileNode } from '$lib/files';
    import Node from './Node.svelte';
    import Fa from 'svelte-fa';

    type Narrow<T, N> = T extends { type: N } ? T : never;

    export let node: Narrow<FileNode, 'DIRECTORY'>;

    let open = false;
</script>

<div class="folder">
    <button class="name" on:click={() => (open = !open)}>
        <Fa icon={faChevronRight} size="xs" rotate={open ? 90 : 0} />
        <p class="name">{node.name}</p>
    </button>

    {#if open}
        <div class="children">
            {#each node.children as newNode}
                <Node node={newNode} />
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
    .folder {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        .name {
            all: unset;
            display: flex;
            align-items: center;
            gap: 2px;
            padding: 2px 8px;
            &:hover:not(.children:hover),
            &:focus:not(.children:focus) {
                background-color: var(--background-tertiary);
            }
        }
        .children {
            padding-left: 8px;
        }
    }
</style>
