/* @flow */

let _store = {};

export default _store;

function store(
    name: string,
    freeze: Function,
    thaw: Function,
    store: Storage
): void {
    Object.defineProperty(_store, name, {
        enumerable: true,
        get: () => serializer.thaw(store.getItem(name)),
        set: (value) => store.setItem(serializer.freeze(value)),
    })
}

export function storeLength(name: string, storage: Storage): void {
    store(
        name,
        (value) => `${value}`,
        (frozen) => parseInt(frozen || "") || 0,
        storage
    );
}

export function storeString(name: string, storage: Storage): void {
    const identity = (value) => value;

    store(
        name,
        identity,
        identity,
        storage
    );
}

export function storeJSON(name: string, storage: Storage): void {
    store(
        name,
        (value) => JSON.stringify(value),
        (frozen) => JSON.parse(frozen),
        storage
    );
}

export function storeArray(name: string, storage: Storage): void {
    store(
        name,
        (value) => JSON.stringify(value),
        (frozen) => Array.from(JSON.parse(frozen)),
        storage
    );
}
