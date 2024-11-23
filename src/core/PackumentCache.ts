import { Cache } from './cache';
import { type PackumentInfo } from './Package';

/*
    Packument is a special data format used in the npm (Node Package Manager) ecosystem to describe packages.
    It serves as a structured representation of information about a package, including its metadata and available versions.
*/
export class PackumentCache extends Cache<PackumentInfo> {
    async wrap(key: string) {
        const value = this.get(key);

        if (value === undefined) {
            const result = await sendRequest<PackumentInfo>(key);

            this.set(key, result);
            return result;
        }

        return value;
    }
}

async function sendRequest<T>(packageName: string): Promise<T> {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    const result = (await response.json()) as T;
    console.log('result -->', result);
    if (!response.ok) {
        throw new Error('Error');
    }

    return result;
}
