export class QueueNode<T> {
    value: T;
    next: QueueNode<T> | null;

    constructor(value: T, next: QueueNode<T> | null = null) {
        this.value = value;
        this.next = next;
    }
}
