/* @flow */

class ObjectStorage {
    _store: Object;

    constructor() {
        this.clear();
    }

    get length(): number {
        return Object.keys(this._store).length;
    }

    getItem(key: string): ?string {
        return this._store[key];
    }

    setItem(key: string, data: string): void {
        this._store[key] = data;
    }

    clear(): void {
        this._store = {};
    }

    removeItem(key: string): void {
        delete this._store[key]
    }

    key(index: number): ?string {
        Object.keys(this._store)[index]
    }

}

export default function NewStorage(): Storage {
    // flow wants `[key: string]: ?string`,
    // but there's no way to implement that
    // $FlowIgnore
    return new ObjectStorage();
}
