/* @flow */

import strategies from "./storage/strategies";

/**
 * Polyfill some more methods onto storage
 */
export default class PersistentStorage {

    static impl(): Storage {
        return strategies.persistent;
    }

    static getItem(key: string): ?(string|number|boolean) {
        return this.impl().getItem(key);
    }

    static setItem(key: string, obj: string|number|boolean): void {
        this.impl().setItem(key, `${obj}`);
    }

    static getJSON(key: string): any {
        let item = this.getItem(key);

        if (!item) {
            return null;
        }

        if (typeof item != "string") {
            console.error("Cannot getJSON with non-string ");
            return null;
        }

        try {
            return JSON.parse(item);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static setJSON(key: string, obj: mixed): void {
        this.setItem(key, JSON.stringify(obj));
    }

    static clear(): void {
        this.impl().clear();
    }

}

export class SessionStorage extends PersistentStorage {
    static impl(): Storage {
        return strategies.session;
    }
}

if (typeof window != "undefined") {
    window.IzzyStorage = Storage
    window.IzzySessionStorage = SessionStorage
}
