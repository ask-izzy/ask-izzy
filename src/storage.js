/* @flow */
/**
 * Polyfill some more methods onto storage
 *
 * DRH: I"ve deliberately chosen to be verbose instead of
 * clever here, to get the benefits of static typing.
 */

import {
    persistentStore,
    sessionStore,
} from "./storage/polyfill";

const Storage = {

    getHistoryLength(): number {
        return parseInt(sessionStore.getItem("historyLength") || "") || 0
    },

    setHistoryLength(length: number): void {
        sessionStore.setItem("historyLength", `${length}`);
    },

    getCoordinates(): ?Coordinates {
        return JSON.parse(sessionStore.getItem("coordinates") || "null");
    },

    setCoordinates(coords: ?Coordinates): void {
        sessionStore.setItem("coordinates", JSON.stringify(coords));
    },

    getItem(key: string): ?(string|number|boolean) {
        return persistentStore.getItem(key);
    },

    setItem(key: string, obj: string|number|boolean): void {
        persistentStore.setItem(key, `${obj}`);
    },

    getJSON(key: string): any {
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
    },

    setJSON(key: string, obj: mixed): void {
        this.setItem(key, JSON.stringify(obj));
    },

    clear(): void {
        persistentStore.clear();
        sessionStore.clear();
    },

}

if (typeof window != "undefined") {
    window.IzzyStorage = Storage
}

export default Storage;
