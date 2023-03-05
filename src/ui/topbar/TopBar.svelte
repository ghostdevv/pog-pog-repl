<script lang="ts">
    import LoadExample from './file/LoadExample.svelte';
    import PeekFs from './file/PeekFs.svelte';
</script>

<div class="topbar">
    <button class="bar-button dropdown">
        <p>File</p>

        <div class="dropdown-content">
            <LoadExample />
            <hr />
            <PeekFs />
        </div>
    </button>
</div>

<style lang="scss">
    .topbar {
        grid-area: topbar;

        width: 100%;
        height: fit-content;

        display: flex;
        align-items: stretch;
        gap: 16px;

        background-color: var(--background-secondary);
    }
</style>
