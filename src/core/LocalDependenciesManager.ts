import * as vscode from 'vscode';

import { fm } from './FileManager';
import { PackageJsonReader, type PackageJson } from './PackageJsonReader';

import { MissingNodeModulesError, MissingPackageJsonError } from './errors';

interface LocalDependenciesManagerParams {
    packageJsonFile: PackageJson;
    packageJsonDirectory: string;
}

interface DependencyInfo {
    name: string;
    range: string;
    packageJson: PackageJson;
}

export class LocalDependenciesManager {
    private directoryPath: vscode.Uri;
    private dependencies: Array<[string, string]>;
    private devDependencies: Array<[string, string]>;

    constructor(params: LocalDependenciesManagerParams) {
        /*
            Get installed dependencies and devDependencies
        */
        const { dependencies, devDependencies } = params.packageJsonFile;

        this.dependencies = Object.entries(dependencies);
        this.devDependencies = Object.entries(devDependencies);

        this.directoryPath = vscode.Uri.file(params.packageJsonDirectory);
    }

    private resolvePackageJsonPath(moduleName: string): vscode.Uri {
        return fm.joinPath(this.directoryPath, 'node_modules', moduleName, 'package.json');
    }

    private resolveNodeModulesPath(): vscode.Uri {
        return fm.joinPath(this.directoryPath, 'node_modules');
    }

    private async *getPackageJsonDependencies(
        dependenciesNames: Array<[string, string]>
    ): AsyncGenerator<DependencyInfo> {
        const nodeModulesPath = this.resolveNodeModulesPath();

        if (!fm.exist(nodeModulesPath)) {
            throw new MissingNodeModulesError(nodeModulesPath.fsPath);
        }

        for (const [dependencyName, range] of dependenciesNames) {
            const packageJsonPath = this.resolvePackageJsonPath(dependencyName);

            const dependencyBaseInfo = {
                name: dependencyName,
                range,
            };

            if (fm.exist(packageJsonPath)) {
                try {
                    const packageJsonModule = await PackageJsonReader.read(packageJsonPath);

                    yield Object.assign({ packageJson: packageJsonModule }, dependencyBaseInfo);
                } catch (e) {
                    console.log(e);
                }
            } else {
                console.log('MissingPackageJsonError');
                // yield new MissingPackageJsonError(dependencyName, packageJsonPath.fsPath);
            }
        }
    }

    async *getDependencies() {
        yield* this.getPackageJsonDependencies(this.dependencies);
    }

    async *getDevelopmentDependencies() {
        yield* this.getPackageJsonDependencies(this.devDependencies);
    }
}
