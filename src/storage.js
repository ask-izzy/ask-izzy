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

import * as gtm from "./google-tag-manager";

type Coordinates = {
    latitude: number,
    longitude: number,
}

type CoordWithLocationName = {
    latitude: number,
    longitude: number,
    name: string,
}

const Storage = {

    getSearch(): string {
        return sessionStore.getItem("search") || "";
    },

    setSearch(search: string): void {
        sessionStore.setItem("search", search);

        gtm.emit({
            event: "Input Submitted - Search",
            eventCat: "Input submitted",
            eventAction: "Text search",
            eventLabel: search,
            sendDirectlyToGA: true,
        });
    },

    getDebug(): boolean {
        return this.getItem("debug") === "true";
    },

    setDebug(debug: boolean): void {
        this.setItem("debug", debug);
    },

    getLocation(): string {
        return (
            this.getItem("location") && String(this.getItem("location"))
        ) || "";
    },

    setLocation(location: string): void {
        this.setItem("location", location);
    },

    getUserIsIndigenous(): boolean {
        return this.getItem("sub-indigenous") ==
            "Yes - show these first where possible" ||
        this.getArray("demographics")
            .includes("Aboriginal and/or Torres Strait Islander");
    },

    getCoordinates(): ?CoordWithLocationName {
        const coords = JSON.parse(
            sessionStore.getItem("coordinates") || "null"
        );

        if (coords &&
            (typeof coords.latitude === "number") &&
            (typeof coords.longitude === "number")) {
            return coords;
        }

        return null;
    },

    setCoordinates(coords: ?Coordinates, name?: string): void {
        const {longitude, latitude} = coords || {};

        if (name) {
            sessionStore.setItem(
                "coordinates",
                JSON.stringify({longitude, latitude, name})
            );
        } else {
            sessionStore.setItem(
                "coordinates",
                JSON.stringify({longitude, latitude})
            );
        }
    },

    getItem(key: string): ?(string|number|boolean) {
        return persistentStore.getItem(key);
    },

    setItem(key: string, obj: string|number|boolean): void {
        if (obj.toString().match(/family violence/i)) {
            switchToPrivateMode();
        }

        const gtmIgnoredKeys = ["previous_search_url"]

        if (!gtmIgnoredKeys.includes(key)) {
            gtm.emit({
                event: "Personalisation Response Given",
                eventCat: this.getItem(key) ?
                    "Change Personalisation Response"
                    : "Set Personalisation Response",
                eventAction: key,
                eventLabel: String(obj),
                sendDirectlyToGA: true,
            })

            gtm.emit({
                event: "Input Submitted - Personalisation",
                eventCat: "Input submitted",
                eventAction: `Personalisation - ${key}`,
                eventLabel: String(obj),
                eventValue: this.getItem(key) ? 1 : 0,
                sendDirectlyToGA: true,
            })
        }

        persistentStore.setItem(key, obj.toString());
    },

    getArray(key: string): Array<any> {
        return Array.from(this.getJSON(key) || []);
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
            console.error(
                `Error when parsing JSON while fetching "${key}" from storage`
            )
            console.error(error);
            return null;
        }
    },

    // Widen obj types as necessary
    setJSON(key: string, obj: Array<string> | {}): void {
        const emitGTMEvent = (value: string) => {
            gtm.emit({
                event: "Input Submitted - Personalisation",
                eventCat: "Input submitted",
                eventAction: `Personalisation - ${key} (single value)`,
                eventLabel: value,
                eventValue: this.getItem(key) ? 1 : 0,
                sendDirectlyToGA: true,
            })
        }

        if (obj instanceof Array) {
            if (obj.length === 0) {
                emitGTMEvent("<none>")
            }
            for (const val of obj) {
                gtm.emit({
                    event: "Personalisation Response",
                    eventCat: this.getItem(key) ?
                        "Change Personalisation Response"
                        : "Set Personalisation Response",
                    eventAction: `${key} (single value)`,
                    eventLabel: val,
                    sendDirectlyToGA: true,
                })

                emitGTMEvent(val)
            }
            obj.sort()
        }

        this.setItem(key, JSON.stringify(obj));
    },

    setGeolocationMock(success: boolean, result: any): void {
        this.setJSON("mock-geolocation", {success, result});
    },

    getGeolocationMock(): any {
        return this.getJSON("mock-geolocation");
    },

    clear(): void {
        persistentStore.clear();
        sessionStore.clear();
        clearPrivateMode();
    },

    removeItem(key: string): void {
        persistentStore.removeItem(key);
        sessionStore.removeItem(key);
    },
}

if (typeof window != "undefined") {
    window.IzzyStorage = Storage
}

export default Storage;
