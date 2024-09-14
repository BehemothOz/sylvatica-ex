import { Queue } from './queue';

class TaskManager<TaskResult> {
    tasks: Queue<() => Promise<TaskResult>> = new Queue();

    isRunning = false;

    constructor() {}

    addTask(task: (() => Promise<TaskResult>) | Promise<TaskResult>) {
        if (this.isRunning) {
            throw new Error('The task execution process has already started');
        }

        if (typeof task === 'function') {
            this.tasks.enqueue(task);
        } else {
            this.tasks.enqueue(() => task);
        }
    }
}

export async function* getResultGnTest(iterable: Iterable<() => Promise<any>>, limit: number = 4) {
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
