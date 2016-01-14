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
    switchToPrivateMode,
    clearPrivateMode,
} from "./storage/polyfill";

import sendEvent from "./google-tag-manager";

const Storage = {

    getDebug(): boolean {
        return this.getItem("debug") == "true";
    },

    setDebug(debug: boolean): void {
        this.setItem("debug", debug);
    },

    getHistoryLength(): number {
        return parseInt(sessionStore.getItem("historyLength") || "") || 0;
    },

    setHistoryLength(length: number): void {
        sessionStore.setItem("historyLength", `${length}`);
    },

    getLocation(): string {
        return this.getItem("location") || "";
    },

    setLocation(location: string): void {
        this.setItem("location", location);
    },

    getCoordinates(): ?Coordinates {
        return JSON.parse(sessionStore.getItem("coordinates") || "null");
    },

    setCoordinates(coords: ?Coordinates): void {
        const {longitude, latitude} = coords || {};

        sessionStore.setItem(
            "coordinates",
            JSON.stringify({longitude, latitude})
        );
    },

    getItem(key: string): ?(string|number|boolean) {
        return persistentStore.getItem(key);
    },

    setItem(key: string, obj: string|number|boolean): void {
        if ((key == "demographics") &&
            `${obj}`.match(/family violence/i)) {
            switchToPrivateMode();
        }

        let event = {};

        event[key] = obj;
        event[`personalize-${key}`] = obj;
        sendEvent(event);
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
        clearPrivateMode();
    },

}

if (typeof window != "undefined") {
    window.IzzyStorage = Storage
}

export default Storage;
