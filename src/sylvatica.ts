import { TaskManager } from './core/TaskManager';
import { Package, type PackumentInfo } from './core/Package';
import { type WebviewPanel } from './core/webview';
import { type LocalDependenciesManager } from './core/LocalDependenciesManager';
import { type PackumentCache } from './core/PackumentCache';

async function sendRequest<T>(packageName: string): Promise<T> {
    console.time(`Time: ${packageName}`);
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    const result = (await response.json()) as T;
    console.timeEnd(`Time: ${packageName}`);
    return result;
}

class PackagesStore {
    /*
       axios: {
        prev: {
            range: '',
            version: '',
        },
        current: {
            range: '',

            version: '',
        },
    },
    */
}

export class Sylvatica {
    taskManager: TaskManager;
    packages: Map<string, Package> = new Map();

    constructor(
        private dependenciesManager: LocalDependenciesManager,
        private webviewPanel: WebviewPanel,
        private packumentCache: PackumentCache
    ) {
        this.taskManager = new TaskManager();
    }

    async initialization() {
        this.webviewPanel.dispatcher.initialization();

        /*
            TODO: check range and current version
        */
        for await (const dependencyVersion of this.dependenciesManager.getDependenciesVersions()) {
            const localPackage = new Package(dependencyVersion);
            this.packages.set(dependencyVersion.name, localPackage);

            this.taskManager.addTask(() => {
                return this.packumentCache.wrap(dependencyVersion.name, () =>
                    sendRequest<PackumentInfo>(dependencyVersion.name)
                );
            });
        }

        await this.getLatestDependenciesVersions();

        this.webviewPanel.dispatcher.sendDependencies(Array.from(this.packages.values()));
    }

    private async getLatestDependenciesVersions() {
        /*
            TODO: fix types
        */
        for await (const packumentInfo of this.taskManager.run()) {
            const packument = (await packumentInfo) as PackumentInfo;
            console.log(packument);
            const localPackage = this.packages.get(packument.name);

            if (localPackage) {
                localPackage.setPackument(packument);
            }
        }
    }
}
