<script lang="ts">
    import { get_container } from '$lib/container';

    const container = get_container();

    let src: string | undefined = undefined;

    container.on('server-ready', (port: number, url: string) => {
        src = url;
    });
</script>

<iframe class="output" {src} title="Result" />

<style lang="scss">
    .output {
        grid-area: output;

        width: 100%;
        height: 100%;
        max-height: 100%;

        border: none;
        background-color: #eee;
    }
</style>
