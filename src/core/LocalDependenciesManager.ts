import * as vscode from 'vscode';

import { fm } from './FileManager';
import { PackageJsonReader, type PackageJson } from './PackageJsonReader';

interface LocalPackageVersion {
    name: string;
    version: string;
}

interface LocalDependenciesManagerParams {
    packageJsonFile: PackageJson;
    packageJsonDirectory: string;
}

export class LocalDependenciesManager {
    private directoryPath: vscode.Uri;
    private dependencies: Array<string>;
    private devDependencies: Array<string>;

    /*
        TODO: mb use version from packageJson?
    */
    constructor(params: LocalDependenciesManagerParams) {
        /*
            Get installed dependencies
        */
        const { dependencies, devDependencies } = params.packageJsonFile;

        this.dependencies = Object.keys(dependencies);
        this.devDependencies = Object.keys(devDependencies);

        this.directoryPath = vscode.Uri.file(params.packageJsonDirectory);
    }

    private resolvePackageJsonPath(moduleName: string) {
        return fm.joinPath(this.directoryPath, 'node_modules', moduleName, 'package.json');
    }

    async getPackagesVersion(moduleNames: Array<string>) {
        const localPackagesVersion: Array<LocalPackageVersion> = [];

        for (const moduleName of moduleNames) {
            const packageJsonPath = this.resolvePackageJsonPath(moduleName);

            if (fm.exist(packageJsonPath)) {
                try {
                    const packageJsonModule = await PackageJsonReader.read(packageJsonPath);
                    localPackagesVersion.push({ name: moduleName, version: packageJsonModule.version });
                } catch (e) {
                    console.log(e);
                }
            }
        }

        return localPackagesVersion;
    }

    async getDependenciesVersions() {
        return this.getPackagesVersion(this.dependencies);
    }

    async getDevDependenciesVersions() {
        return this.getPackagesVersion(this.devDependencies);
    }
}
