import * as vscode from 'vscode';
import * as path from 'path';

import { PackumentCache } from './PackumentCache';
import { Registry } from '../registry';

export class PackumentService {
    caches: Map<string, PackumentCache> = new Map();

    async register(packageJsonPath: string) {
        const packageJsonDirectory = vscode.Uri.file(path.dirname(packageJsonPath));
        const currentRegistry = await Registry.build(packageJsonDirectory);

        const packumentCache = new PackumentCache(currentRegistry);

        this.caches.set(packageJsonPath, packumentCache);

        return packumentCache;
    }

    delete(packageJsonPath: string) {
        this.caches.delete(packageJsonPath);
    }

    clear() {
        this.caches = new Map();
    }
}
