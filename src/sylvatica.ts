import * as vscode from 'vscode';
import * as path from 'path';

import { TaskManager } from './core/TaskManager';
import { Package, type PackumentInfo } from './core/Package';
import { PackageJsonReader } from './core/PackageJsonReader';
import { PackageManagerService } from './core/package-manager';
import { PackageManagerStrategy } from './core/package-manager/types';
import { LocalDependenciesManager, type DependencyInfo } from './core/LocalDependenciesManager';

import { type WebviewPanel } from './core/webview';
import { type PackumentCache } from './core/PackumentCache';

async function sendRequest<T>(packageName: string): Promise<T> {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    const result = (await response.json()) as T;
    console.log('result -->', result);
    if (!response.ok) {
        throw new Error('Error');
    }

    return result;
}

interface DependenciesFactoryParams {
    cache: PackumentCache;
}

abstract class DependenciesFactory {
    private taskManager: TaskManager;
    private cache: PackumentCache;

    private _packages: Map<string, Package> = new Map();

    constructor(params: DependenciesFactoryParams) {
        this.taskManager = new TaskManager();
        this.cache = params.cache;
    }

    get packages() {
        return this._packages;
    }

    async analyze(dependencies: AsyncIterable<DependencyInfo>) {
        for await (const dependencyVersion of dependencies) {
            const localPackage = new Package(dependencyVersion);
            this.packages.set(dependencyVersion.name, localPackage);

            this.taskManager.addTask(() => {
                return this.cache.wrap(dependencyVersion.name, () =>
                    sendRequest<PackumentInfo>(dependencyVersion.name)
                );
            });
        }

        await this.getLatestVersions();
    }

    private async getLatestVersions() {
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

class LocalDependencies extends DependenciesFactory {}

class LocalDevelopmentDependencies extends DependenciesFactory {}

/*
    TODO: Create fabric classes for Dependencies and Dev-Dependencies
*/
export class Sylvatica {
    private taskManager: TaskManager;
    private taskManager2: TaskManager;

    private packageManagerService: PackageManagerService;

    private localDependenciesManager: LocalDependenciesManager | null = null;

    private packages: Map<string, Package> = new Map();
    private packages2: Map<string, Package> = new Map();
    private packageManager: PackageManagerStrategy | null = null;

    constructor(private webviewPanel: WebviewPanel, private packumentCache: PackumentCache) {
        this.taskManager = new TaskManager();
        this.taskManager2 = new TaskManager();
        this.packageManagerService = new PackageManagerService();
    }

    async initialization(file: vscode.Uri) {
        console.log('initialization');
        this.webviewPanel.dispatcher.initialization();

        const json = await PackageJsonReader.read(file);
        const packageJsonDirectory = path.dirname(file.fsPath);

        this.localDependenciesManager = new LocalDependenciesManager({
            packageJsonFile: json,
            packageJsonDirectory,
        });

        this.packageManager = await this.packageManagerService.getPackageManager(packageJsonDirectory);

        if (this.packageManager) {
            this.webviewPanel.dispatcher.notifyPackageManagerReady();
        }
    }

    // analyze?
    async run() {
        console.log(111111111);
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

        this.next();

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

    async next() {
        for await (const devDependencyVersion of this.localDependenciesManager!.getDevDependenciesVersions()) {
            console.log('devDependencyVersion', devDependencyVersion);
            const localPackage = new Package(devDependencyVersion);
            console.log('localPackage', localPackage);
            this.packages2.set(devDependencyVersion.name, localPackage);
            console.log(this.packages2);
            this.taskManager2.addTask(() => {
                return this.packumentCache.wrap(devDependencyVersion.name, () =>
                    sendRequest<PackumentInfo>(devDependencyVersion.name)
                );
            });
        }

        await this.getLatestDevDependenciesVersions();
        console.log(this.packages2);
        this.webviewPanel.dispatcher.sendDevDependencies(Array.from(this.packages2.values()));
    }

    private async getLatestDevDependenciesVersions() {
        /*
            TODO: fix types
        */
        for await (const packumentInfo of this.taskManager2.run()) {
            const packument = (await packumentInfo) as PackumentInfo;
            const localPackage = this.packages2.get(packument.name);

            if (localPackage) {
                localPackage.setPackument(packument);
            }
        }
    }
}
