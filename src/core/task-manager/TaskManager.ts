import { Queue } from '../queue';

interface TaskItem<T> {
    originalFn: () => Promise<T>;
    resultPromise: Promise<T> | null;
    /*
        retryCount: number;
    */
}

interface FulfilledTask<T> {
    status: 'fulfilled';
    payload: T;
}

interface RejectedTask<E> {
    status: 'rejected';
    payload: E;
}

export class TaskManager<ResultValue = unknown, ErrorResult = Error> {
    tasks: Queue<TaskItem<ResultValue>> = new Queue();
    waitingTasks: Queue<TaskItem<ResultValue>> = new Queue();

    taskIterator: IterableIterator<TaskItem<ResultValue>> | null = null;

    limit: number;
    isRunning = false;

    constructor(limit: number = 4) {
        this.limit = limit;
    }

    addTask(fn: () => Promise<ResultValue>) {
        if (this.isRunning) {
            throw new Error('The task execution process has already started');
        }

        const taskItem: TaskItem<ResultValue> = {
            originalFn: fn,
            resultPromise: null,
        };

        this.tasks.enqueue(taskItem);

        return this;
    }

    async *run(): AsyncGenerator<FulfilledTask<ResultValue> | RejectedTask<ErrorResult>> {
        this.initializeTasks();

        while (true) {
            if (this.waitingTasks.size === 0) {
                this.clear();
                return;
            }

            const waitingTask = this.waitingTasks.dequeue()!;

            if (!waitingTask.resultPromise) return;

            try {
                const value = await waitingTask.resultPromise;
                yield {
                    status: 'fulfilled',
                    payload: value,
                };
            } catch (error) {
                yield {
                    status: 'rejected',
                    payload: error as ErrorResult,
                };
            }
        }
    }

    private addTaskToComplete() {
        if (this.taskIterator == null) return;

        const { value: task, done } = this.taskIterator.next();

        if (done) return;

        this.completeTask(task);
    }

    private completeTask(task: TaskItem<ResultValue>) {
        const promise = task.originalFn().finally(() => {
            this.addTaskToComplete();
        });

        task.resultPromise = promise;

        this.waitingTasks.enqueue(task);
    }

    private initializeTasks() {
        this.taskIterator = this.tasks.values();
        this.isRunning = true;

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

export class TaskExecutionError extends Error {
    constructor(originalError: Error) {
        super(`Task failed to execute: ${originalError?.message || 'Unknown error'}`);
        this.name = 'TaskExecutionError';

        console.log('originalError', originalError);

        if (originalError) {
            this.stack = originalError.stack;
        }
    }
}
