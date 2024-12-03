import * as vscode from 'vscode';

import { fm } from './FileManager';
import { PackageJsonParseError } from './errors';

interface PackageJsonFile {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

export class PackageJson {
    constructor(private packageJsonFile: PackageJsonFile) {}

    get name() {
        return this.packageJsonFile.name;
    }

    get version() {
        return this.packageJsonFile.version;
    }

    get dependencies() {
        return this.packageJsonFile.dependencies ?? {};
    }

    get devDependencies() {
        return this.packageJsonFile.devDependencies ?? {};
    }
}

export class PackageJsonReader {
    static async read(packageJsonPath: vscode.Uri) {
        try {
            const fileContent = await fm.readFile(packageJsonPath);
            const parsedPackageJson = JSON.parse(fileContent) as PackageJson;

            return new PackageJson(parsedPackageJson);
        } catch (error) {
            throw new PackageJsonParseError(packageJsonPath.fsPath);
        }
    }
}
