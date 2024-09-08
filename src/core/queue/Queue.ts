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
        return deletedNode;
    }

    get size() {
        return this._size;
    }
}
