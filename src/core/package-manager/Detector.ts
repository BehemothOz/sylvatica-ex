import * as path from 'path';
import * as fs from 'fs/promises';

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

export class PackageManagerDetector {
    async detect(directoryPath: string) {
        const promises = [];

        for (const packageManager of packageManagers) {
            const { name, lockFile } = packageManager;
            const lockFilePath = path.resolve(directoryPath, lockFile);

            const promise = this.fileExists(lockFilePath).then(() => name);
            promises.push(promise);
        }

        return Promise.any(promises).catch(() => null);
    }

    fileExists(path: string) {
        return fs.access(path); // OR await fs.stat(filePath);
    }

    detectSync(directoryPath: string) {
        const a = fs.readdir(directoryPath);
    }
}
