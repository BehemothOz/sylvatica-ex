import { Cache } from './core/cache';

interface Data {
    id: number;
    title: string;
    body: string;
}

export class Sylvatica {
    cache: Cache<Data>;

    constructor() {
        this.cache = new Cache();
    }
}
