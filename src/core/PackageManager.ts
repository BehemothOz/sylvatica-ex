import * as vscode from 'vscode';

import { fm } from './FileManager';
import { PackageJsonReader, type PackageJson } from './PackageJsonReader';

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

    async getPackagesVersion(moduleNames: Array<string>) {
        for (const moduleName of moduleNames) {
            const packageJsonPath = fm.joinPath(this.directoryPath, 'node_modules', moduleName, 'package.json');

            if (fm.exist(packageJsonPath)) {
                try {
                    const packageJsonModule = await PackageJsonReader.read(packageJsonPath);
                    console.log(moduleName, packageJsonModule.version);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    getDependenciesVersions() {}

    getDevDependenciesVersions() {}
}
