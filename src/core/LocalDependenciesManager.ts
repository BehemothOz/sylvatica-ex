import * as vscode from 'vscode';

import { fm } from './FileManager';
import { PackageJsonReader, type PackageJson, type PackageJsonParseError } from './PackageJsonReader';

interface LocalDependenciesManagerParams {
    packageJsonFile: PackageJson;
    // TODO: mb URI type?
    packageJsonDirectory: string;
}

export interface LocalDependencyInfo {
    name: string;
    range: string;
    packageJson: PackageJson;
}

type LocalDependencyError = MissingPackageJsonError | PackageJsonParseError;

export type LocalDependencyResult = LocalDependencyInfo | LocalDependencyError;

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
    ): AsyncGenerator<LocalDependencyResult> {
        const nodeModulesPath = this.resolveNodeModulesPath();

        if (!fm.exist(nodeModulesPath)) {
            throw new MissingNodeModulesError(nodeModulesPath.fsPath);
        }

        for (const [dependencyName, range] of dependenciesNames) {
            const packageJsonPath = this.resolvePackageJsonPath(dependencyName);

            if (fm.exist(packageJsonPath)) {
                try {
                    const packageJsonModule = await PackageJsonReader.read(packageJsonPath);

                    yield {
                        name: dependencyName,
                        range,
                        packageJson: packageJsonModule,
                    };
                } catch (parseJsonError) {
                    yield parseJsonError as PackageJsonParseError;
                }
            } else {
                yield new MissingPackageJsonError(dependencyName, packageJsonPath.fsPath);
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

export class MissingNodeModulesError extends Error {
    constructor(directoryPath: string) {
        super(`Directory "node_modules" is missing in "${directoryPath}".`);

        this.name = 'MissingNodeModulesError';
    }
}

export class MissingPackageJsonError extends Error {
    constructor(dependencyName: string, packageJsonPath: string) {
        super(`Package.json for dependency "${dependencyName}" is missing at "${packageJsonPath}".`);

        this.name = 'MissingPackageJsonError';
    }
}
