import { Cache } from './cache';
import { type PackumentInfo } from './Package';

/*
    Packument is a special data format used in the npm (Node Package Manager) ecosystem to describe packages.
    It serves as a structured representation of information about a package, including its metadata and available versions.
*/
export class PackumentCache extends Cache<PackumentInfo> {
    async wrap(key: string, fn: () => Promise<PackumentInfo>) {
        const value = this.get(key);

        if (value === undefined) {
            const result = await fn();
            console.log("result", result);

            this.set(key, result);
            return result;
        }

        return value;
    }
}
