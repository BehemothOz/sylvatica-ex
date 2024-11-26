import * as vscode from 'vscode';
import * as path from 'path';

import { Package } from './core/Package';
import { PackageJsonReader } from './core/PackageJsonReader';
import { PackageManagerService } from './core/package-manager';
import { PackageManagerStrategy } from './core/package-manager/types';
import { LocalDependenciesManager } from './core/LocalDependenciesManager';
import { DependenciesFactory } from './core/DependenciesFactory';

import { type WebviewPanel } from './core/webview';
import { type PackumentCache } from './core/PackumentCache';

export class Sylvatica {
    private packageManagerService: PackageManagerService;

    private localDependenciesManager: LocalDependenciesManager | null = null;

    private packageManager: PackageManagerStrategy | null = null;

    private dependencies: DependenciesFactory;
    private developmentDependencies: DependenciesFactory;

    constructor(private webviewPanel: WebviewPanel, packumentCache: PackumentCache) {
        this.packageManagerService = new PackageManagerService();

        this.dependencies = new DependenciesFactory(packumentCache);
        this.developmentDependencies = new DependenciesFactory(packumentCache);

        this.dependencies.on((packages: Package[]) => {
            this.webviewPanel.sendDependencies(packages);
        });

        this.developmentDependencies.on((packages: Package[]) => {
            this.webviewPanel.sendDevDependencies(packages);
        });
    }

    async initialization(file: vscode.Uri) {
        this.webviewPanel.initialization();

        const json = await PackageJsonReader.read(file);
        const packageJsonDirectory = path.dirname(file.fsPath);

        this.localDependenciesManager = new LocalDependenciesManager({
            packageJsonFile: json,
            packageJsonDirectory,
        });

        this.packageManager = await this.packageManagerService.getPackageManager(packageJsonDirectory);

        if (this.packageManager) {
            console.log(this.packageManager);
        }
    }

    async analyze() {
        const installedDependenciesVersions = this.localDependenciesManager!.getDependenciesVersions();
        const installedDevDependenciesVersions = this.localDependenciesManager!.getDevDependenciesVersions();

        await this.dependencies.analyze(installedDependenciesVersions);
        this.developmentDependencies.analyze(installedDevDependenciesVersions);
    }
}
