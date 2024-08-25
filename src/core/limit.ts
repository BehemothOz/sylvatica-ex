class Queue<T> {
    #queue: Array<T> = [];

    enqueue(value: T) {
        this.#queue.push(value);
    }

    dequeue() {
        if (this.size === 0) {
            return null;
        }

        return this.#queue.shift();
    }

    get size() {
        return this.#queue.length;
    }
}

async function* getResultGnTest(iterable: Iterable<() => Promise<any>>, limit: number = 2) {
    const queue = new Queue();

    const tasks = [...iterable];
    const iterator = tasks.entries();

    let pending = tasks.length;

    function addTaskToComplete() {
        const chunk = iterator.next();

        if (chunk.done) {
            return;
        }

        const [_, fn] = chunk.value;

        const promise = fn().then(res => {
            pending -= 1;
            addTaskToComplete();

            return res;
        });

        queue.enqueue(promise);
    }

    for (let i = 0; i < limit; i += 1) {
        addTaskToComplete();
    }

    while (true) {
        if (queue.size === 0 && pending === 0) {
            return;
        }

        const promise = queue.dequeue();
        yield promise;
    }
}
