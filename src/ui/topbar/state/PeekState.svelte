<script lang="ts">
    import { file_tree } from '$lib/state';

    async function peek() {
        console.log('peek state command', {
            $file_tree,
        });
    }
</script>

<button on:click={peek}>Peek State</button>
