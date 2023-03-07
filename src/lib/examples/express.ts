import { stripIndent } from 'common-tags';
import { JSONFSNode } from '$lib/files';

export const files: JSONFSNode[] = [
    {
        type: 'FILE',
        name: 'package.json',
        contents: stripIndent`
            {
                "name": "express-example",
                "type": "module",
                "dependencies": {
                    "express": "latest",
                    "nodemon": "latest"
                },
                "devDependencies": {
                    "@types/express": "^4.17.17",
                    "@types/node": "^18.14.6"
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
                    import express from 'express';
                
                    const app = express();

                    app.get('/', (req, res) => {
                        res.send('Hello World');
                    })

                    app.listen(3000, () => {
                        console.log('Online at http://localhost:3000');
                    })
                `,
            },
        ],
    },
];
