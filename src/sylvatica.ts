import * as vscode from 'vscode';
import * as path from 'path';

import { type Package } from './core/package';
import { PackageJsonReader } from './core/PackageJsonReader';
import { PackageManagerService } from './core/package-manager';
import { LocalDependenciesManager } from './core/LocalDependenciesManager';
import { DependenciesFactory } from './core/DependenciesFactory';

import { type WebviewPanel } from './core/webview';
import { type PackumentCache } from './core/packument-service';

export class Sylvatica {
    private packageManagerService: PackageManagerService;

    private dependencies: DependenciesFactory;
    private developmentDependencies: DependenciesFactory;

    private localDependenciesManager!: LocalDependenciesManager;

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

        const packageManager = await this.packageManagerService.getPackageManager(packageJsonDirectory);

        if (packageManager) {
            console.log('packageManager', packageManager);
        }
    }

    async analyze() {
        const dependenciesVersions = this.localDependenciesManager.getDependencies();
        const developmentDependenciesDependencies = this.localDependenciesManager.getDevelopmentDependencies();

        await this.dependencies.analyze(dependenciesVersions);
        this.developmentDependencies.analyze(developmentDependenciesDependencies);
    }
}
