import { Queue } from './queue';

export class TaskManager<TaskResult> {
    tasks: Queue<() => Promise<TaskResult>> = new Queue();
    waitingTasks: Queue<Promise<TaskResult>> = new Queue();

    taskIterator: IterableIterator<() => Promise<TaskResult>> | null = null;

    limit: number;
    pending: number = 0;

    isRunning = false;

    constructor(limit: number = 4) {
        this.limit = limit;
    }

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

    async *run() {
        this.initializeTasks();

        while (true) {
            if (this.waitingTasks.size === 0 && this.pending === 0) {
                this.clear();
                return;
            }

            yield this.waitingTasks.dequeue();
        }
    }

    private addTaskToComplete() {
        if (this.taskIterator == null) return;

        const chunk = this.taskIterator.next();

        if (chunk.done) {
            return;
        }

        const fn = chunk.value;

        const promise = fn().then(res => {
            this.pending -= 1;
            this.addTaskToComplete();

            return res;
        });

        this.waitingTasks.enqueue(promise);
    }

    private initializeTasks() {
        this.taskIterator = this.tasks.values();

        this.isRunning = true;
        this.pending = this.tasks.size;

        for (let i = 0; i < this.limit; i += 1) {
            this.addTaskToComplete();
        }
    }

    private clear() {
        this.isRunning = false;

        this.tasks = new Queue();
        this.taskIterator = null;
    }
}
