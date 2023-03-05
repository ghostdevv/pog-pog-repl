import { FileNode } from '$lib/files';
import { stripIndent } from 'common-tags';

export const files: FileNode[] = [
    {
        type: 'FILE',
        name: 'package.json',
        path: 'package.json',
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
        path: 'tsconfig.json',
        contents: stripIndent`
            {

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
                name: 'index.ts',
                path: 'src/index.ts',
                contents: stripIndent`
                    console.log('Hello from Typescript' as unknown as any as unknown as string)
                `,
            },
        ],
    },
];
