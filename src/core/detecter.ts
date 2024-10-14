import * as path from 'path';
import * as fs from 'fs/promises';

type PackageManagerName = 'yarn' | 'npm' | 'pnpm';

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

interface PackageManagerStrategy {
    upgrade: (latestVersion: string) => void;
}

class PackageManager {
    strategies: Map<PackageManagerName, PackageManagerStrategy> = new Map();

    constructor(strategies: Record<PackageManagerName, PackageManagerStrategy>) {
        const strategyNames = Object.keys(strategies) as Array<PackageManagerName>;

        strategyNames.forEach((strategyName) => {
            this.strategies.set(strategyName, strategies[strategyName]);
        });
    }

    use(strategyName: PackageManagerName) {
        const strategy = this.strategies.get(strategyName);

        if (strategy) return strategy;
        throw new Error('add a strategy before using it');
    }
}

class Npm implements PackageManagerStrategy {
    upgrade(latestVersion: string) {
        console.log();
    }
}

class Pnpm implements PackageManagerStrategy {
    upgrade(latestVersion: string) {
        console.log();
    }
}

class Yarn implements PackageManagerStrategy {
    upgrade(latestVersion: string) {
        console.log();
    }
}

const packageManager = new PackageManager({
    npm: new Npm(),
    yarn: new Yarn(),
    pnpm: new Pnpm(),
});
