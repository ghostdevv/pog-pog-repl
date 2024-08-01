import { stripIndent } from 'common-tags';
import { JSONFSNode } from '$lib/files';

export const files: JSONFSNode[] = [
    {
        type: 'FILE',
        name: 'package.json',
        contents: stripIndent`
            {
                "name": "hono-example",
                "type": "module",
                "dependencies": {
                    "nodemon": "^3.1.4"
                },
                "devDependencies": {
                    "@types/node": "^18.19.42",
                    "hono": "^4.5.3"
                },
                "scripts": {
                    "dev": "nodemon src/index.js"
                }
            }
        `,
    },
    {
        type: 'DIRECTORY',
        name: 'src',
        children: [
            {
                type: 'FILE',
                name: 'index.js',
                contents: stripIndent`
                    import { Hono } from 'hono';

                    const app = new Hono();

                    app.get('/', (c) => {
                        c.text('Hello World');
                    })

                    export default app;
                `,
            },
        ],
    },
];
