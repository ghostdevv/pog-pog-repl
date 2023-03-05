<script lang="ts">
    import { get_container } from '$lib/container';
    import { onMount } from 'svelte';
    import { Terminal } from 'xterm';

    let element: HTMLDivElement;

    const container = get_container();

    onMount(async () => {
        const terminal = new Terminal({
            convertEol: true,
        });

        terminal.open(element);

        const shell = await container.spawn('jsh');

        shell.output.pipeTo(
            new WritableStream({
                write(data) {
                    terminal.write(data);
                },
            }),
        );

        const input = shell.input.getWriter();

        terminal.onData((data) => {
            input.write(data);
        });
    });
</script>

<div class="terminal">
    <div bind:this={element} />
</div>

<style lang="scss">
    .terminal {
        grid-area: terminal;

        width: 100%;
        height: 100%;
    }
</style>
