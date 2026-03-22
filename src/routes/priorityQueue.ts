type QueueItem<T> = {
    value: T;
    priority: number;
};

export class PriorityQueue<T> {
    private items: QueueItem<T>[] = [];
    private maxSize = 100;

    enqueue(value: T, priority: number) {
        this.items.push({ value, priority });
        this.items.sort((a, b) => b.priority - a.priority); // higher = higher priority
        if (this.items.length > this.maxSize) this.items = this.items.slice(0, this.maxSize);
    }

    dequeue(): T | undefined {
        return this.items.shift()?.value;
    }

    peek(): T | undefined {
        return this.items[0]?.value;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

    getItems(): T[] {
        return this.items.map(i => i.value);
    }
}