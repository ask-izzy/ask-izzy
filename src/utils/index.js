/* @flow */
import storage from "../storage";

// Taken from https://stackoverflow.com/a/52551910/847536
export function toCamelCase(str: string) {
    return str.toLowerCase().replace(
        /[^a-zA-Z0-9]+(.)/g,
        (match, chr) => chr.toUpperCase()
    );
}

export function wait(timeToWait: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeToWait))
}

export function emitPageLoadEvent(): void {
    if (typeof CustomEvent === "undefined" || typeof document === "undefined") {
        return
    }

    const pageLoadEvent = new CustomEvent("pageComponentLoad");
    document.dispatchEvent(pageLoadEvent);
    window.pageComponentLoaded = true
}

export const stateFromLocation = (): string => {
    const states = [
        "ACT",
        "NSW",
        "NT",
        "QLD",
        "SA",
        "TAS",
        "VIC",
        "WA",
    ];

    const location = storage.getLocation()
    const state = location.split(",").pop().trim()

    if (states.indexOf(state) !== -1) {
        return state;
    }
    return ""
}