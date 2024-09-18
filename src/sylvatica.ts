import * as vscode from 'vscode';
import * as path from 'path';

import { type PackageJson } from './core/PackageJsonReader';
import { type LocalDependenciesManager } from './core/LocalDependenciesManager';

interface SylvaticaParams {
    packageJsonFile: PackageJson;
    packageJsonDirectory: string;
}

export class Sylvatica {
    constructor(private dependenciesManager: LocalDependenciesManager) {}

    async initialization() {
        const d = await this.dependenciesManager.getDependenciesVersions();
        const dd = await this.dependenciesManager.getDevDependenciesVersions();
    }
}
