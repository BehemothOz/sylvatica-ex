import { QueueNode } from './QueueNode';

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
