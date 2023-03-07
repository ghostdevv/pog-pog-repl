import { stripIndent } from 'common-tags';
import { JSONFSNode } from '$lib/files';

export const files: JSONFSNode[] = [
    {
        type: 'FILE',
        name: 'package.json',
        contents: stripIndent`
            {
                "name": "typescript-example",
                "type": "module"
            }
        `,
    },
    {
        type: 'FILE',
        name: 'tsconfig.json',
        contents: stripIndent`
            {

            }
        `,
    },
    {
        type: 'DIRECTORY',
        name: 'src',
        children: [
            {
                type: 'FILE',
                name: 'index.ts',
                contents: stripIndent`
                    console.log('Hello from Typescript' as unknown as any as unknown as string)
                `,
            },
        ],
    },
];
