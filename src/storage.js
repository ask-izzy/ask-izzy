/* @flow */
/**
 * Polyfill some more methods onto storage
 */

import koekje from "koekje";

class Storage {

    static getItem(key: string): ?(string|number|boolean) {
        return koekje.getItem(key);
    }

    static setItem(key: string, obj: string|number|boolean): void {
        koekje.setItem(key, obj);
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
        koekje.clear();
    }
}

if (typeof window != "undefined") {
    window.IzzyStorage = Storage
}

export default Storage;
