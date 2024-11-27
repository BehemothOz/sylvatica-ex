import * as vscode from 'vscode';

import { fm } from './FileManager';
import { PackageJsonReader, type PackageJson } from './PackageJsonReader';

interface LocalDependenciesManagerParams {
    packageJsonFile: PackageJson;
    packageJsonDirectory: string;
}

export interface DependencyInfo {
    name: string;
    range: string;
    version: string;
}

export class LocalDependenciesManager {
    private directoryPath: vscode.Uri;
    private dependencies: Array<[string, string]>;
    private devDependencies: Array<[string, string]>;

    /*
        TODO: mb use version from packageJson?
    */
    constructor(params: LocalDependenciesManagerParams) {
        /*
            Get installed dependencies
        */
        const { dependencies, devDependencies } = params.packageJsonFile;

        this.dependencies = Object.entries(dependencies);
        this.devDependencies = Object.entries(devDependencies);

        this.directoryPath = vscode.Uri.file(params.packageJsonDirectory);
    }

    /*
        TODO: Check exist node_modules folder
    */
    private resolvePackageJsonPath(moduleName: string) {
        return fm.joinPath(this.directoryPath, 'node_modules', moduleName, 'package.json');
    }

    private resolveNodeModulesPath() {
        return fm.exist(fm.joinPath(this.directoryPath, 'node_modules'));
    }

    async *getPackagesVersion(moduleNames: Array<[string, string]>): AsyncGenerator<PackageJson> {
        for (const [moduleName, range] of moduleNames) {
            const packageJsonPath = this.resolvePackageJsonPath(moduleName);

            if (fm.exist(packageJsonPath)) {
                try {
                    const packageJsonModule = await PackageJsonReader.read(packageJsonPath);

                    yield packageJsonModule;
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    async *getDependenciesVersions() {
        yield* this.getPackagesVersion(this.dependencies);
    }

    async *getDevDependenciesVersions() {
        yield* this.getPackagesVersion(this.devDependencies);
    }
}
