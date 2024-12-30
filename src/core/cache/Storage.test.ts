import { Storage } from './Storage';

describe('Storage', () => {
    let storage: Storage<string>;

    beforeEach(() => {
        storage = new Storage<string>(3);
    });

    it('should successfully store a value with set method and retrieve it with get method', () => {
        storage.set('key1', 'value1');
        expect(storage.get('key1')).toBe('value1');

        storage.set('key2', 'value2');
        expect(storage.get('key2')).toBe('value2');
    });

    it('should remove a value with delete method', () => {
        storage.set('key3', 'value3');
        storage.delete('key3');
        expect(storage.get('key3')).toBeUndefined();
    });

    it('should clear all stored values with clear method', () => {
        storage.set('key1', 'value1');
        storage.set('key2', 'value2');
        storage.clear();
        expect(storage.size).toBe(0);
    });

    it('should evict the oldest value when exceeding storage capacity', () => {
        storage.set('key1', 'value1');
        storage.set('key2', 'value2');
        storage.set('key3', 'value3');
        storage.set('key4', 'value4');
        expect(storage.get('key1')).toBeUndefined();
        expect(storage.get('key2')).toBe('value2');
        expect(storage.get('key3')).toBe('value3');
        expect(storage.get('key4')).toBe('value4');
    });
});
