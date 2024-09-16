import * as vscode from 'vscode';

import { fm } from './FileManager';
import { PackageJsonReader, type PackageJson } from './PackageJsonReader';

interface LocalPackageVersion {
    name: string;
    version: string;
}

interface LocalDependenciesManagerParams {
    directoryPath: string;
    rootPackageJson: PackageJson;
}

export class LocalDependenciesManager {
    private directoryPath: vscode.Uri;
    private dependencies: Array<string>;
    private devDependencies: Array<string>;

    /*
        TODO: mb use version from packageJson?
    */
    constructor(params: LocalDependenciesManagerParams) {
        const { dependencies, devDependencies } = params.rootPackageJson;

        this.dependencies = Object.keys(dependencies);
        this.devDependencies = Object.keys(devDependencies);

        this.directoryPath = vscode.Uri.file(params.directoryPath);
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

    getDependenciesVersions() {}

    getDevDependenciesVersions() {}
}
