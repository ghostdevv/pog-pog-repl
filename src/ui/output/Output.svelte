<script lang="ts">
    import { faRefresh } from '@fortawesome/free-solid-svg-icons';
    import { get_container } from '$lib/container';
    import Fa from 'svelte-fa';

    const container = get_container();

    let src: string = '';
    let frame: HTMLIFrameElement;

    container.on('server-ready', (_port: number, url: string) => {
        src = url;
    });

    function reload() {
        frame.src += '';
    }
</script>

<div class="output">
    <div class="controls">
        <button class="icon" on:click={reload}>
            <Fa icon={faRefresh} />
        </button>

        <input type="text" class="url" bind:value={src} />
    </div>

    <iframe bind:this={frame} class="frame" {src} title="Result" />
</div>

<style lang="scss">
    .output {
        grid-area: output;

        display: flex;
        flex-direction: column;

        .controls {
            background-color: var(--background-secondary);
            padding: 12px 8px;

            display: flex;
            align-items: center;
            gap: 8px;
        }

        .url {
            padding: 8px 12px;
            border-width: 2px;
            font-size: 1rem;
        }

        .frame {
            flex-grow: 1;

            border: none;
            background-color: #eee;
        }
    }
</style>
