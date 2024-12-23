import { Cache } from '../cache';
import { Registry } from '../registry';

import { type PackumentInfo } from '../package';

/*
    Packument is a special data format used in the npm (Node Package Manager) ecosystem to describe packages.
    It serves as a structured representation of information about a package, including its metadata and available versions.
*/
export class PackumentCache extends Cache<PackumentInfo> {
    constructor(private registry: Registry) {
        super();
    }

    async wrap(packageName: string) {
        const value = this.get(packageName);

        if (value === undefined) {
            const scope = packageName.split('/')[0];
            const registryUrl = this.registry.getRegistryUrl(scope);
            console.log('registryUrl', registryUrl);
            const result = await sendRequest<PackumentInfo>(packageName, registryUrl);

            this.set(packageName, result);
            return result;
        }

        return value;
    }
}

async function sendRequest<T>(packageName: string, registryUrl: string): Promise<T> {
    const packageUrl = new URL(`${encodeURIComponent(packageName).replace(/^%40/, '@')}/latest`, registryUrl);

    try {
        const response = await fetch(packageUrl, {
            headers: {
                accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*',
            },
        });

        if (!response.ok) {
            throw new Error('Error');
        }

        const result = (await response.json()) as T;
        console.log('result fetch -->', result);

        return result;
    } catch (error) {
        throw new Error('Error');
    }
}

class PackumentFetchError extends Error {
    packageName: string;

    constructor(message: string, statusCode: number) {
        super(message);

        this.name = 'FetchError';

        // this.statusCode = statusCode; // Код состояния HTTP

        Error.captureStackTrace(this, this.constructor); // ?
    }
}
