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
import type {AnalyticsEvent} from "./google-tag-manager";

export type Geolocation = {
    name: string,
    latitude: number,
    longitude: number,
    approximate?: boolean
}

const Storage = {
    getSearch(): string {
        return sessionStore.getItem("search") || "";
    },

    setSearch(
        search: string,
        analyticsEventDetails?: AnalyticsEvent
    ): void {
        sessionStore.setItem("search", search);

        gtm.emit({
            event: "Input Submitted - Search",
            eventCat: "Input submitted",
            eventAction: "Text search",
            eventLabel: search,
            eventValue: 1,
            sendDirectlyToGA: true,
            ...analyticsEventDetails,
        });
    },

    getDebug(): boolean {
        return this.getItem("debug") === "true";
    },

    setDebug(debug: boolean): void {
        this.setItem("debug", debug);
    },

    getLocation(): ?Geolocation {
        return this.getJSON("location");
    },

    setLocation(location: Geolocation): void {
        this.setJSON("location", location);
    },

    clearLocation(): void {
        this.removeItem("location")
    },

    hasPreciseLocation(): boolean {
        return this.getLocation() &&
            !this.getLocation().approximate
    },

    getItem(key: string): ?string {
        return persistentStore.getItem(key);
    },

    setItem(
        key: string,
        obj: string|number|boolean,
        emitAnalyticsEvent: boolean = true
    ): void {
        if (obj.toString().match(/family violence/i)) {
            switchToPrivateMode();
        }

        if (emitAnalyticsEvent) {
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
