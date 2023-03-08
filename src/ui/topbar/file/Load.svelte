<script lang="ts">
    import { get_container } from '$lib/container';
    import { refresh_state } from '$lib/state';
    import { load_ppr } from '$lib/files';

    const container = get_container();

    function read_text_file(file: File) {
        return new Promise<string>((resolve) => {
            const reader = new FileReader();

            reader.onload = function () {
                let result: string = '';

                if (typeof reader.result === 'string') {
                    result = reader.result;
                } else if (reader.result) {
                    const decoder = new TextDecoder();
                    result = decoder.decode(reader.result);
                }

                resolve(result);
            };

            reader.readAsText(file);
        });
    }

    async function load_ppr_file() {
        const file_input = document.createElement('input');
        file_input.type = 'file';
        file_input.accept = '.ppr';

        async function callback() {
            const file = file_input.files?.[0];

            if (file) {
                const result = await read_text_file(file);

                if (result.length) {
                    await load_ppr(container, result);
                    await refresh_state(container);
                }
            }

            file_input.removeEventListener('change', callback);
        }

        file_input.addEventListener('change', callback);

        file_input.click();
    }
</script>

<button class="secondary" on:click={load_ppr_file}>Load REPL</button>
