import { Cache } from '../cache';
import { Registry } from '../registry';

import { type PackageDocumentInfo } from '../package';

export interface PackumentWrappedValue {
    key: string;
    value: PackageDocumentInfo;
}

export interface PackumentWrappedErrorValue {
    key: string;
    reason: Error;
}

/*
    Packument is a special data format used in the npm (Node Package Manager) ecosystem to describe packages.
    It serves as a structured representation of information about a package, including its metadata and available versions.
*/
export class PackumentCache extends Cache<PackageDocumentInfo> {
    constructor(private registry: Registry) {
        super();
    }

    async wrap(packageName: string): Promise<PackumentWrappedValue> {
        const value = this.get(packageName);

        if (value !== undefined) {
            return { key: packageName, value };
        }

        const scope = packageName.split('/')[0];
        const registryUrl = this.registry.getRegistryUrl(scope);

        /*
            Check registry url by packageName (see console)
        */
        console.log('registryUrl', registryUrl);

        try {
            const packumentResponse = await sendRequest<PackageDocumentInfo>(packageName, registryUrl);
            this.set(packageName, packumentResponse);

            return {
                key: packageName,
                value: packumentResponse,
            };
        } catch (error) {
            throw {
                key: packageName,
                reason: error,
            };
        }
    }
}

export class PackumentFetchError extends Error {
    constructor(originalError: Error) {
        super(`Task failed to execute: ${originalError?.message || 'Unknown error'}`);
        this.name = 'TaskExecutionError';

        console.log('originalError', originalError);

        if (originalError) {
            this.stack = originalError.stack;
        }
    }
}

async function sendRequest<T>(packageName: string, registryUrl: string): Promise<T> {
    const packageUrl = new URL(`${encodeURIComponent(packageName).replace(/^%40/, '@')}/latest`, registryUrl);

    const response = await fetch(packageUrl, {
        headers: {
            accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*',
        },
    });

    if (!response.ok) {
        throw new Error(`Network error. Status: ${response.status}`);
    }

    return (await response.json()) as T;
}
