<main>
    <textarea class="editor" />
    <iframe class="result" src="https://echo.willow.sh?q=asd" title="Result" />
</main>

<style lang="scss">
    main {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: stretch;

        width: 100%;
        height: 100vh;
    }

    .result,
    .editor {
        width: 100%;
        height: 100%;
        max-height: 100%;
    }

    .editor {
        resize: none;
        border-radius: 0;
        border-color: var(--background-tertiary);
    }

    .result {
        border: none;
        background-color: #eee;
    }
</style>
