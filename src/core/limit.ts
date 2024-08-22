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

async function getAsyncResultMock(key: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`Result for ${key}`);
        }, key * 1000);
    });
}

async function getAsyncResult(id: number): Promise<unknown> {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);

    return await response.json();
}

(async () => {
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const limit = 4;

    const q = keys.map(key => {
        return () => getAsyncResultMock(key);
    });

    for await (const result of getResultGnTest(q, limit)) {
        console.log(result);
    }
})();
