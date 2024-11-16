export class QueueNode<T> {
    value: T;
    next: QueueNode<T> | null;

    constructor(value: T, next: QueueNode<T> | null = null) {
        this.value = value;
        this.next = next;
    }
}

export class Queue<T> {
    private head: QueueNode<T> | null;
    private tail: QueueNode<T> | null;
    private _size: number;

    constructor() {
        this.head = null;
        this.tail = null;

        this._size = 0;
    }

    get size() {
        return this._size;
    }

    /**
     * Add a new element to the end of the queue (the tail of the linked list).
     */
    enqueue(value: T) {
        const node = new QueueNode(value);

        if (this.tail) {
            this.tail.next = node;
            this.tail = node;
        } else {
            this.head = node;
            this.tail = node;
        }

        this._size += 1;
        return this;
    }

    /**
     * Remove the element at the front of the queue (the head of the linked list).
     * If the queue is empty, return null.
     */
    dequeue() {
        if (this.head === null) {
            return null;
        }

        const deletedNode = this.head;

        if (this.head.next) {
            this.head = this.head.next;
        } else {
            this.head = null;
            this.tail = null;
        }

        this._size -= 1;
        return deletedNode.value;
    }

    /**
     * Read the element at the front of the queue without removing it.
     */
    peek() {
        if (this.head === null) {
            return null;
        }

        return this.head.value;
    }

    isEmpty() {
        return this._size === 0;
    }

    /**
     * @returns Returns an iterator over the values of the queue.
     */
    values(): IterableIterator<T> {
        let current = this.head;

        return {
            [Symbol.iterator]() {
                return this;
            },
            next: () => {
                if (current === null) {
                    return { done: true, value: undefined };
                }

                const result = {
                    done: false,
                    value: current.value,
                };

                current = current.next;

                return result;
            },
        };
    }

    [Symbol.iterator]() {
        return this.values();
    }
}

// interface Task<> {
//   retryCount: number;
//   fn: () => Promise<TaskResult>;
// }

interface WaitingTask<T> {
    originTask: () => Promise<T>;
    resultPromise: Promise<T>;
    retryCount: number;
}

export class TaskManager<TaskResult = unknown> {
    tasks: Queue<() => Promise<TaskResult>> = new Queue();
    waitingTasks: Queue<WaitingTask<TaskResult>> = new Queue();

    taskIterator: IterableIterator<() => Promise<TaskResult>> | null = null;

    limit: number;
    // 7
    pending: number = 0;

    isRunning = false;

    count: number = 0;

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
                if (waitingTask.retryCount === 3) {
                    throw new Error('OOOPPPSSSS');
                }

                waitingTask.retryCount += 1;
                this.waitingTasks.enqueue(waitingTask);
            }
        }
    }

    private addTaskToComplete() {
        if (this.taskIterator == null) return;

        const { value: task, done } = this.taskIterator.next();

        if (done) return;

        this.completeTask(task);
    }

    private completeTask(taskPromiseResult: () => Promise<TaskResult>) {
        const promise = taskPromiseResult()
            .then((res) => {
                this.pending -= 1;

                return res;
            })
            .catch((error) => {
                console.log('error', error);
                // this.pending += 1;
                throw error;
            })
            .finally(() => {
                this.addTaskToComplete();
            });

        const waitingTasksItem = {
            originTask: taskPromiseResult,
            resultPromise: promise,
            retryCount: 0,
        };

        this.waitingTasks.enqueue(waitingTasksItem);
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
