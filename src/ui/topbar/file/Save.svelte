<script lang="ts">
    import { type PPRFile, read_json_fs_free } from '$lib/files';
    import { get_container } from '$lib/container';
    import { copyText } from 'svelte-copy';
    import { onDestroy } from 'svelte';

    const container = get_container();

    async function save_to_disk() {
        const file: PPRFile = {
            data: await read_json_fs_free(container),
        };

        const blob = new Blob([JSON.stringify(file)]);

        const a = document.createElement('a');

        a.href = window.URL.createObjectURL(blob);
        a.download = `${Date.now()}.ppr`;

        a.click();
    }

    let timeout: ReturnType<typeof setTimeout>;
    let copy_text = 'Copy URL';

    async function save_to_url() {
        const file: PPRFile = {
            data: await read_json_fs_free(container),
        };

        const data = btoa(JSON.stringify(file));

        await copyText(`${window.location.origin}?ppr=${data}`);

        const url = new URL(window.location.href);
        url.searchParams.set('ppr', data);

        window.history.replaceState(null, 'PogPogREPL', url);

        copy_text = 'Copied!';
        timeout = setTimeout(() => (copy_text = 'Copy URL'), 1000);
    }

    onDestroy(() => {
        clearTimeout(timeout);
    });
</script>

<div class="row">
    <button class="secondary" on:click={save_to_url}>{copy_text}</button>
    <button class="secondary" on:click={save_to_disk}>Save to Disk</button>
</div>
