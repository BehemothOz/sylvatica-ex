import * as vscode from 'vscode';
import * as path from 'path';

import { Cache } from './cache';
import { Registry } from './registry';

import { type PackumentInfo } from './Package';

export class PackumentService {
    caches: Map<string, PackumentCache> = new Map();

    constructor() {}

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

/*
    Packument is a special data format used in the npm (Node Package Manager) ecosystem to describe packages.
    It serves as a structured representation of information about a package, including its metadata and available versions.
*/
class PackumentCache extends Cache<PackumentInfo> {
    constructor(private registry: Registry) {
        super();
    }

    async wrap(packageName: string) {
        const value = this.get(packageName);

        if (value === undefined) {
            const scope = packageName.split('/')[0];
            const registryUrl = this.registry.getRegistryUrl(scope);

            const result = await sendRequest<PackumentInfo>(packageName, registryUrl);

            this.set(packageName, result);
            return result;
        }

        return value;
    }
}

async function sendRequest<T>(packageName: string, registryUrl: string): Promise<T> {
    const packageUrl = new URL(`${encodeURIComponent(packageName).replace(/^%40/, '@')}/latest`, registryUrl);

    const response = await fetch(packageUrl, {
        headers: {
            accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*',
        },
    });
    const result = (await response.json()) as T;
    console.log('result -->', result);
    if (!response.ok) {
        throw new Error('Error');
    }

    return result;
}
