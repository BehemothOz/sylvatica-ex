import * as vscode from 'vscode';
import * as path from 'path';

import { PackageJsonReader } from './core/PackageJsonReader';
import { PackageManagerService } from './core/package-manager';
import { LocalDependenciesManager } from './core/LocalDependenciesManager';
import { DependenciesFactory } from './core/DependenciesFactory';

import { type Package, type PackageType } from './core/package';
import { type WebviewPanel } from './core/webview';
import { type PackumentCache } from './core/packument-service';

/**
 * Class Sylvatica manages dependencies and interacts with the webview panel in Visual Studio Code.
 */
export class Sylvatica {
    private packageManagerService: PackageManagerService;

    private dependencies: DependenciesFactory;
    private developmentDependencies: DependenciesFactory;

    private localDependenciesManager!: LocalDependenciesManager;

    /**
     * Creates an instance of Sylvatica.
     *
     * @constructor
     * @param {WebviewPanel} webviewPanel - User Interface area.
     * @param {PackumentCache} packumentCache - The cache for package information from registry.
     */
    constructor(private webviewPanel: WebviewPanel, packumentCache: PackumentCache) {
        this.packageManagerService = new PackageManagerService();

        this.dependencies = new DependenciesFactory(packumentCache);
        this.developmentDependencies = new DependenciesFactory(packumentCache);

        this.dependencies.on((packages: PackageType[]) => {
            this.webviewPanel.sendDependencies(packages);
        });

        this.developmentDependencies.on((packages: PackageType[]) => {
            this.webviewPanel.sendDevDependencies(packages);
        });
    }

    /**
     * Initializes the Sylvatica instance with the specified package.json file.
     *
     * @async
     * @param {vscode.Uri} file - The URI of the package.json file to read.
     */
    public async initialization(file: vscode.Uri) {
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

    /**
     * Analyzes the project's dependencies and development dependencies.
     *
     * @async
     */
    public async analyze() {
        const dependenciesVersions = this.localDependenciesManager.getDependencies();
        const developmentDependenciesDependencies = this.localDependenciesManager.getDevelopmentDependencies();

        await this.dependencies.analyze(dependenciesVersions);
        this.developmentDependencies.analyze(developmentDependenciesDependencies);
    }
}
