export interface IStorage<StorageValue> {
    get: (key: string) => StorageValue | void;
    set: (key: string, value: StorageValue) => void;
    delete: (key: string) => void;
    clear: () => void;
    size: number;
}

export class Storage<StorageValue> implements IStorage<StorageValue> {
    #totalSize: number;
    #store: Map<string, StorageValue> = new Map();

    constructor(totalSize: number = 100) {
        this.#totalSize = totalSize;
    }

    get(key: string) {
        return this.#store.get(key);
    }

    set(key: string, value: StorageValue) {
        if (this.size >= this.#totalSize) {
            const oldestKey = this.#store.keys().next().value;
            this.#store.delete(oldestKey);
        }

        this.#store.set(key, value);
    }

    delete(key: string) {
        this.#store.delete(key);
    }

    clear() {
        this.#store.clear();
    }

    get size() {
        return this.#store.size;
    }
}
