import * as path from 'path';
import * as fs from 'fs/promises';

import { type PackageManagerName } from './types';

interface PackageManagerInfo {
    name: PackageManagerName;
    lockFile: string;
}

const packageManagers: Array<PackageManagerInfo> = [
    {
        name: 'yarn',
        lockFile: 'yarn.lock',
    },
    {
        name: 'npm',
        lockFile: 'package-lock.json',
    },
    {
        name: 'pnpm',
        lockFile: 'pnpm-lock.yaml',
    },
];

/*
    TODO: move to FileManager class
*/
function fileExistsAsync(path: string) {
    return fs.access(path); // OR await fs.stat(filePath);
}

export class PackageManagerDetector {
    static async detect(directoryPath: string) {
        const promises = [];

        for (const packageManager of packageManagers) {
            const { name, lockFile } = packageManager;
            const lockFilePath = path.resolve(directoryPath, lockFile);

            const promise = fileExistsAsync(lockFilePath).then(() => name);
            promises.push(promise);
        }

        return Promise.any(promises).catch(() => null);
    }

    /*
        TODO: Implement a synchronous option
        For example: fs.readdir(directoryPath);
    */
    static detectSync() {}
}
