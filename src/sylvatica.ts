import { TaskManager } from './core/TaskManager';
import { Package, type PackumentInfo } from './core/Package';
import { type WebviewPanel } from './core/webview';
import { type LocalDependenciesManager } from './core/LocalDependenciesManager';

const sendRequest = async (packageName: string) => {
    console.time(`Time: ${packageName}`);
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    console.timeEnd(`Time: ${packageName}`);
    return await response.json();
};

export class Sylvatica {
    taskManager: TaskManager;
    packages: Map<string, Package> = new Map();

    constructor(private dependenciesManager: LocalDependenciesManager, private webviewPanel: WebviewPanel) {
        this.taskManager = new TaskManager();
    }

    async initialization() {
        this.webviewPanel.dispatcher.initialization();

        for await (const dependencyVersion of this.dependenciesManager.getDependenciesVersions()) {
            const localPackage = new Package(dependencyVersion);
            this.packages.set(dependencyVersion.name, localPackage);

            this.taskManager.addTask(() => {
                console.log('add task');
                return sendRequest(dependencyVersion.name);
            });
        }

        await this.getLatestDependenciesVersions();

        this.webviewPanel.dispatcher.sendDependencies(Array.from(this.packages.values()));
    }

    private async getLatestDependenciesVersions() {
        /*
            TODO: add types
        */
        for await (const packumentInfo of this.taskManager.run()) {
            const packument = (await packumentInfo) as PackumentInfo;

            const localPackage = this.packages.get(packument.name);

            if (localPackage) {
                localPackage.setPackument(packument);
            }
        }
    }
}
