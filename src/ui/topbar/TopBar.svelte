<script lang="ts">
    import RefreshState from './state/RefreshState.svelte';
    import LoadExample from './file/LoadExample.svelte';
    import PeekState from './state/PeekState.svelte';
    import ResetFS from './file/ResetFS.svelte';
    import Save from './file/Save.svelte';
</script>

<div class="topbar">
    <button class="bar-button dropdown">
        <p>File</p>

        <div class="dropdown-content">
            <LoadExample />
            <hr />
            <ResetFS />
            <hr />
            <Save />
        </div>
    </button>

    <button class="bar-button dropdown">
        <p>State</p>

        <div class="dropdown-content">
            <RefreshState />
            <hr />
            <PeekState />
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
