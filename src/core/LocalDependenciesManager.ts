import * as vscode from 'vscode';

import { fm } from './FileManager';
import { PackageJsonReader, type PackageJson } from './PackageJsonReader';

interface LocalDependenciesManagerParams {
    packageJsonFile: PackageJson;
    packageJsonDirectory: string;
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

    private resolvePackageJsonPath(moduleName: string) {
        return fm.joinPath(this.directoryPath, 'node_modules', moduleName, 'package.json');
    }

    async *getPackagesVersion(moduleNames: Array<[string, string]>) {
        for (const [moduleName, range] of moduleNames) {
            const packageJsonPath = this.resolvePackageJsonPath(moduleName);

            if (fm.exist(packageJsonPath)) {
                try {
                    const packageJsonModule = await PackageJsonReader.read(packageJsonPath);
                    yield { name: moduleName, range, version: packageJsonModule.version };
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
