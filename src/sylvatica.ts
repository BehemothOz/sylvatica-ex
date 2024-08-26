import { Cache } from './core/cache';
import { sendRequest } from './core/send';
import { getResultGnTest } from './core/limit';

interface Data {
    id: number;
    title: string;
    body: string;
}

export class Sylvatica {
    cache: Cache<Data>;
    keys: Array<number> = [1, 2, 3];

    constructor() {
        this.cache = new Cache();
    }

    async init() {
        const functions = this.keys.map(key => () => sendRequest(key));
        const result = getResultGnTest(functions);

        const finished = [];

        for await (const item of result) {
            finished.push(item);
        }

        return finished;
    }
}
