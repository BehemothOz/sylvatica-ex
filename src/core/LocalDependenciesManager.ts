import * as vscode from 'vscode';

import { fm } from './FileManager';
import { PackageJsonReader, type PackageJson, type PackageJsonParseError } from './PackageJsonReader';

interface LocalDependenciesManagerParams {
    packageJsonFile: PackageJson;
    // TODO: mb URI type?
    packageJsonDirectory: string;
}

export interface LocalDependencyInfo {
    range: string;
    packageJson: PackageJson;
}

interface FulfilledResult {
    status: 'fulfilled';
    payload: {
        key: string;
        value: LocalDependencyInfo;
        reason?: never;
    };
}

interface RejectedResult {
    status: 'rejected';
    payload: {
        key: string;
        value?: never;
        reason: MissingPackageJsonError | PackageJsonParseError;
    };
}

export type LocalDependencyResult = FulfilledResult | RejectedResult;

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

            if (!fm.exist(packageJsonPath)) {
                yield {
                    status: 'rejected',
                    payload: {
                        key: dependencyName,
                        reason: new MissingPackageJsonError(dependencyName, packageJsonPath.fsPath),
                    },
                };
            }

            try {
                const packageJsonModule = await PackageJsonReader.read(packageJsonPath);
                const payloadValue = { range, packageJson: packageJsonModule };

                yield {
                    status: 'fulfilled',
                    payload: {
                        key: dependencyName,
                        value: payloadValue,
                    },
                };
            } catch (parseJsonError) {
                yield {
                    status: 'rejected',
                    payload: {
                        key: dependencyName,
                        reason: parseJsonError as PackageJsonParseError,
                    },
                };
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
