import { FileNode } from '$lib/files';
import { stripIndent } from 'common-tags';

export const files: FileNode[] = [
    {
        type: 'FILE',
        name: 'package.json',
        path: 'package.json',
        contents: stripIndent`
            {
                "name": "express-example",
                "type": "module",
                "dependencies": {
                    "express": "latest",
                    "nodemon": "latest"
                },
                "scripts": {
                    "start": "nodemon --watch './' index.js"
                }
            }
        `,
    },
    {
        type: 'DIRECTORY',
        name: 'src',
        path: 'src',
        children: [
            {
                type: 'FILE',
                name: 'index.js',
                path: 'src/index.js',
                contents: stripIndent`
                    import express from 'express';
                
                    const app = express();

                    app.get('/', (req, res) => {
                        res.send('Hello World');
                    })

                    app.listen(3000, () => {
                        console.log('Online');
                    })
                `,
            },
        ],
    },
];
