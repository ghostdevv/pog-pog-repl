import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
    plugins: [svelte()],

    server: {
        headers: {
            'Cross-Origin-Embedder-Policy': 'require-corp',
            'Cross-Origin-Opener-Policy': 'same-origin',
        },
    },

    optimizeDeps: {
        exclude: ['monaco-editor'],
    },

    resolve: {
        alias: {
            $lib: resolve('./src/lib'),
        },
    },
});
