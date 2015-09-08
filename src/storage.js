/**
 * Polyfill some more methods onto storage
 */
/* @flow */

"use strict";

import sessionstorage from "sessionstorage";

class Storage {

    static getItem(key: string): ?(string|number|boolean) {
        return sessionstorage.getItem(key);
    }

    static setItem(key: string, obj: string|number|boolean): void {
        sessionstorage.setItem(key, obj);
    }

    static getJSON(key: string): ?(Object|Array) {
        try {
            return JSON.parse(this.getItem(key));
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    static setJSON(key: string, obj: Object|Array): void {
        this.setItem(key, JSON.stringify(obj));
    }

    static clear(): void {
        sessionstorage.clear();
    }
}

export default Storage;
