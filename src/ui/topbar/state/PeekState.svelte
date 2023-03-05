<script lang="ts">
    import { file_tree, selected_file_path } from '$lib/state';

    async function peek() {
        console.log('peek state command', {
            $file_tree,
            $selected_file_path,
        });
    }
</script>

<button on:click={peek}>Peek State</button>
