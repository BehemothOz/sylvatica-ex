import * as path from 'path';
import * as fs from 'fs/promises';
import { cwd } from 'process';

type PackageManager = 'yarn' | 'npm' | 'pnpm';

interface PackageManagerInfo {
    name: PackageManager;
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

// const stats = await fs.stat(filePath);
// fs.readdir

export class PackageManagerDetector {
    async detect(filePath: string) {
        const promises = [];

        for (const packageManager of packageManagers) {
            const { name, lockFile } = packageManager;
            const lockFilePath = path.resolve(filePath, lockFile);

            const promise = this.fileExists(lockFilePath).then(() => name);
            promises.push(promise);
        }

        return Promise.any(promises).catch(() => null);
    }

    fileExists(path: string) {
        return fs.access(path);
    }
}
