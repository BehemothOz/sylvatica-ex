import { Storage, type IStorage } from './Storage';

export interface CacheValue<T> {
    expiry: number;
    value: T;
}

interface CacheValueOptions {
    ttl: number;
}

export type Milliseconds = number;

const DEFAULT_TTL = 60 * 60 * 1000;

export interface ICache<T> {
    get: (key: string) => T | void;
    set: (key: string, value: T, options: CacheValueOptions) => void;
    delete: (key: string) => void;
    clear: () => void;
    size: number;
}

export class Cache<StorageValue> implements ICache<StorageValue> {
    #storage: IStorage<CacheValue<StorageValue>>;
    #ttl: Milliseconds;

    constructor(ttl: Milliseconds = DEFAULT_TTL) {
        this.#storage = new Storage<CacheValue<StorageValue>>();
        this.#ttl = ttl;
    }

    get(key: string) {
        const valueFromStorage = this.#storage.get(key);

        if (valueFromStorage) {
            const { expiry, value } = valueFromStorage;

            if (Date.now() > expiry) {
                this.#storage.delete(key);
                return;
            }

            return value;
        }

        return;
    }

    set(key: string, value: StorageValue) {
        const expiry = Date.now() + this.#ttl;
        this.#storage.set(key, { expiry, value });
    }

    delete(key: string) {
        return this.#storage.delete(key);
    }

    clear() {
        return this.#storage.clear();
    }

    get size() {
        return this.#storage.size;
    }

    // async wrap(key: string, fn: () => Promise<StorageValue>) {
    //     const value = this.get(key);

    //     if (value === undefined) {
    //         const result = await fn();

    //         this.set(key, result);
    //         return result;
    //     }

    //     return value;
    // }
}
