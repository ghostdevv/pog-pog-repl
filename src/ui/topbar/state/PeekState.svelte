<script lang="ts">
    import {
        changed_file_paths,
        file_tree,
        selected_file_path,
    } from '$lib/state';

    async function peek() {
        console.log('peek state command', {
            $file_tree,
            $selected_file_path,
            $changed_file_paths,
        });
    }
</script>

<button on:click={peek}>Peek State</button>
