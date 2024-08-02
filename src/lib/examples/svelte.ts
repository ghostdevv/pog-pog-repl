import { JSONFSNode } from '$lib/files';

export const files: JSONFSNode[] = [
    {
        type: 'FILE',
        name: 'index.html',
        contents:
            '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Vite + Svelte + TS</title>\n  </head>\n  <body>\n    <div id="app"></div>\n    <script type="module" src="/src/main.ts"></script>\n  </body>\n</html>\n',
    },
    {
        type: 'FILE',
        name: 'package.json',
        contents:
            '{\n  "name": "svelte-t",\n  "private": true,\n  "version": "0.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "preview": "vite preview",\n    "check": "svelte-check --tsconfig ./tsconfig.json && tsc -p tsconfig.node.json"\n  },\n  "devDependencies": {\n    "@sveltejs/vite-plugin-svelte": "^3.1.1",\n    "@tsconfig/svelte": "^5.0.4",\n    "@types/node": "^18.19.42",\n    "ghostsui": "^1.6.0",\n    "svelte": "^4.2.18",\n    "svelte-check": "^3.8.4",\n    "tslib": "^2.6.3",\n    "typescript": "^5.2.2",\n    "vite": "^5.3.4"\n  }\n}\n',
    },
    {
        type: 'DIRECTORY',
        name: 'public',
        children: [
            {
                type: 'FILE',
                name: 'vite.svg',
                contents:
                    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>',
            },
        ],
    },
    {
        type: 'DIRECTORY',
        name: 'src',
        children: [
            {
                type: 'FILE',
                name: 'App.svelte',
                contents:
                    '<script lang="ts">\n    import Counter from \'$lib/Counter.svelte\';\n\n    let count: number;\n</script>\n\n<main>\n    <h1>Hello World! {count}</h1>\n    <Counter bind:count />\n</main>\n\n<style>\n    main {\n        position: fixed;\n        top: 50%;\n        left: 50%;\n        transform: translate(-50%, -50%);\n\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        gap: 12px;\n    }\n</style>\n',
            },
            {
                type: 'DIRECTORY',
                name: 'lib',
                children: [
                    {
                        type: 'FILE',
                        name: 'Counter.svelte',
                        contents:
                            '<script lang="ts">\n    export let count: number = 0;\n\n    function increment() {\n        count += 1;\n    }\n</script>\n\n<button on:click={increment}>\n    count is {count}\n</button>\n',
                    },
                ],
            },
            {
                type: 'FILE',
                name: 'main.ts',
                contents:
                    "import 'ghostsui';\nimport App from './App.svelte';\n\nconst app = new App({\n    target: document.getElementById('app')!,\n});\n\nexport default app;\n",
            },
            {
                type: 'FILE',
                name: 'vite-env.d.ts',
                contents:
                    '/// <reference types="svelte" />\n/// <reference types="vite/client" />\n',
            },
        ],
    },
    {
        type: 'FILE',
        name: 'svelte.config.js',
        contents:
            "import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'\n\nexport default {\n  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess\n  // for more information about preprocessors\n  preprocess: vitePreprocess(),\n}\n",
    },
    {
        type: 'FILE',
        name: 'tsconfig.json',
        contents:
            '{\n  "extends": "@tsconfig/svelte/tsconfig.json",\n  "compilerOptions": {\n    "target": "ESNext",\n    "useDefineForClassFields": true,\n    "module": "ESNext",\n    "resolveJsonModule": true,\n    /**\n     * Typecheck JS in `.svelte` and `.js` files by default.\n     * Disable checkJs if you\'d like to use dynamic types in JS.\n     * Note that setting allowJs false does not prevent the use\n     * of JS in `.svelte` files.\n     */\n    "allowJs": true,\n    "checkJs": true,\n    "isolatedModules": true,\n    "moduleDetection": "force"\n  },\n  "include": ["src/**/*.ts", "src/**/*.js", "src/**/*.svelte"]\n}\n',
    },
    {
        type: 'FILE',
        name: 'vite.config.ts',
        contents:
            "import { svelte } from '@sveltejs/vite-plugin-svelte';\nimport { dirname, join } from 'node:path';\nimport { fileURLToPath } from 'node:url';\nimport { defineConfig } from 'vite';\n\nconst __dirname = dirname(fileURLToPath(import.meta.url));\n\n// https://vitejs.dev/config/\nexport default defineConfig({\n    plugins: [svelte()],\n\n    resolve: {\n        alias: {\n            $lib: join(__dirname, './src/lib'),\n        },\n    },\n});\n",
    },
];
