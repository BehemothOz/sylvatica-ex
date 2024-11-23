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

import { DependenciesFactory } from './core/DependenciesFactory';

async function sendRequest<T>(packageName: string): Promise<T> {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    const result = (await response.json()) as T;
    console.log('result -->', result);
    if (!response.ok) {
        throw new Error('Error');
    }

    return result;
}

/*
    TODO: Create fabric classes for Dependencies and Dev-Dependencies
*/
export class Sylvatica {
    private packageManagerService: PackageManagerService;

    private localDependenciesManager: LocalDependenciesManager | null = null;

    private packageManager: PackageManagerStrategy | null = null;

    private dependencies: DependenciesFactory;

    constructor(private webviewPanel: WebviewPanel, private packumentCache: PackumentCache) {
        this.packageManagerService = new PackageManagerService();

        this.dependencies = new DependenciesFactory(packumentCache);

        this.dependencies.on((packages: Package[]) => {
            this.webviewPanel.dispatcher.sendDependencies(packages);
        });

        /*
            - LocalDependencies
            - LocalDevelopmentDependencies
        */
    }

    async initialization(file: vscode.Uri) {
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

    async analyze() {}
}
