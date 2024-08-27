import * as path from 'path';
import * as fs from 'fs/promises';
import { cwd } from 'process';

/*
    yarn | npm | pnpm
*/

async function fileExists(path: string) {
    return await fs.access(path);
}

/*
    TODO: bun.lockb
*/
const lockFiles = ['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml'];

async function detecter() {
    const promises = lockFiles.map(file => {
        const p = path.resolve(cwd(), file);
        return fileExists(p);
    });

    const result = Promise.any(promises)
        .then(res => console.log(res))
        .catch(err => console.log(err));
}
