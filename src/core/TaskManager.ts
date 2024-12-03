import { Queue } from './queue';

interface TaskItem<T> {
    originalFn: () => Promise<T>;
    resultPromise: Promise<T> | null;
    /*
        retryCount: number;
    */
}

export class TaskManager<TaskResult = unknown> {
    tasks: Queue<TaskItem<TaskResult>> = new Queue();
    waitingTasks: Queue<TaskItem<TaskResult>> = new Queue();

    taskIterator: IterableIterator<TaskItem<TaskResult>> | null = null;

    limit: number;
    isRunning = false;

    constructor(limit: number = 4) {
        this.limit = limit;
    }

    addTask(fn: () => Promise<TaskResult>) {
        if (this.isRunning) {
            throw new Error('The task execution process has already started');
        }

        const taskItem: TaskItem<TaskResult> = {
            originalFn: fn,
            resultPromise: null,
        };

        this.tasks.enqueue(taskItem);
    }

    async *run() {
        this.initializeTasks();

        while (true) {
            if (this.waitingTasks.size === 0) {
                this.clear();
                return;
            }

            const waitingTask = this.waitingTasks.dequeue();

            if (waitingTask === null) return;

            try {
                yield await waitingTask.resultPromise;
            } catch (error) {
                console.log(waitingTask);
            }
        }
    }

    private addTaskToComplete() {
        if (this.taskIterator == null) return;

        const { value: task, done } = this.taskIterator.next();

        if (done) return;

        this.completeTask(task);
    }

    private completeTask(task: TaskItem<TaskResult>) {
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
