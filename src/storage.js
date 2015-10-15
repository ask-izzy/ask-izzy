/* @flow */
/**
 * Polyfill some more methods onto storage
 */

import sessionstorage from "sessionstorage";

class Storage {

    static getItem(key: string): ?(string|number|boolean) {
        return sessionstorage.getItem(key);
    }

    static setItem(key: string, obj: string|number|boolean): void {
        sessionstorage.setItem(key, obj);
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
        sessionstorage.clear();
    }
}

export default Storage;
