import * as vscode from 'vscode';

import { fm } from './FileManager';

/**
 *  Represents the required structure of a `package.json` file.
 */
interface PackageJsonFile {
    /**
     * Name of the package.
     */
    name: string;
    /**
     * Version of the package.
     */
    version: string;
    /**
     * Dependencies of the package, if any.
     */
    dependencies?: Record<string, string>;
    /**
     * Development dependencies of the package, if any.
     */
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

/**
 *  A class for reading and parsing `package.json` files.
 */
export class PackageJsonReader {
    /**
     *  Reads and parses a `package.json` file from the given URI.
     */
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

export class PackageJsonParseError extends Error {
    constructor(filePath: string, originalError?: Error) {
        super(`Failed to parse package.json at "${filePath}": ${originalError?.message}`);

        this.name = 'PackageJsonParseError';

        if (originalError) {
            this.stack = originalError.stack;
        }
    }
}
