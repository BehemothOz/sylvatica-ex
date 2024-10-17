import * as vscode from 'vscode';
import * as path from 'path';

import { TaskManager } from './core/TaskManager';
import { Package, type PackumentInfo } from './core/Package';
import { PackageJsonReader } from './core/PackageJsonReader';
import { PackageManagerService } from './core/package-manager';
import { PackageManagerStrategy } from './core/package-manager/types';
import { LocalDependenciesManager } from './core/LocalDependenciesManager';

import { type WebviewPanel } from './core/webview';
import { type PackumentCache } from './core/PackumentCache';

async function sendRequest<T>(packageName: string): Promise<T> {
    console.time(`Time: ${packageName}`);
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    const result = (await response.json()) as T;
    console.timeEnd(`Time: ${packageName}`);
    return result;
}

export class Sylvatica {
    private taskManager: TaskManager;

    private packageManagerService: PackageManagerService;
    private localDependenciesManager: LocalDependenciesManager | null = null;

    private packages: Map<string, Package> = new Map();
    private packageManager: PackageManagerStrategy | null = null;

    constructor(private webviewPanel: WebviewPanel, private packumentCache: PackumentCache) {
        this.taskManager = new TaskManager();
        this.packageManagerService = new PackageManagerService();
    }

    async initialization(file: vscode.Uri) {
        console.log(888);
        this.webviewPanel.dispatcher.initialization();

        const json = await PackageJsonReader.read(file);
        const packageJsonDirectory = path.dirname(file.fsPath);

        this.localDependenciesManager = new LocalDependenciesManager({
            packageJsonFile: json,
            packageJsonDirectory,
        });
        console.log(111);
        this.packageManager = await this.packageManagerService.getPackageManager(packageJsonDirectory);
        console.log("this.packageManager", this.packageManager);
        if (this.packageManager) {
            this.webviewPanel.dispatcher.notifyPackageManagerReady();
        }
    }

    // analyze?
    async run() {
        /*
            TODO: check range and current version
        */
        for await (const dependencyVersion of this.localDependenciesManager!.getDependenciesVersions()) {
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
            const localPackage = this.packages.get(packument.name);

            if (localPackage) {
                localPackage.setPackument(packument);
            }
        }
    }
}
