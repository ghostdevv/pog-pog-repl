<script lang="ts">
    import { file_tree } from '$lib/state';
    import Node from './Node.svelte';
</script>

<div class="fs">
    {#each $file_tree as node}
        <Node {node} />
    {/each}
</div>

<style lang="scss">
    .fs {
    }
</style>
