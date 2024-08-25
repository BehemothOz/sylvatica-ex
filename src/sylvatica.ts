import { Cache } from './core/cache';
import { sendRequest } from './core/send';

interface Data {
    id: number;
    title: string;
    body: string;
}

export class Sylvatica {
    cache: Cache<Data>;
    keys: Array<number> = [1, 2, 3, 4, 5];

    constructor() {
        this.cache = new Cache();
    }

    init() {
        const functions = this.keys.map(key => sendRequest(key));
        return functions;
    }
}
