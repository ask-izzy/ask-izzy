/* @flow */

import "./utils/polyfills/custom-events"

export function emit(event: GTMEvent): void {
    if (typeof window === "undefined") {
        return;
    }

    window.dataLayer = window.dataLayer || [];
    // Fix a weird GTM bug where if you set an existing variable to an array
    // that is shorter than the array it previously contained then the old
    // array values will remain
    if (window.google_tag_manager) {
        for (const key in event) {
            if (Array.isArray(event[key])) {
                window.google_tag_manager[process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID]
                    .dataLayer.set(key, undefined)
            }
        }
    }

    // Emit custom browser event for logging/debugging purposes
    if (window.CustomEvent) {
        const browserEvent = new CustomEvent(
            browserEventName,
            {detail: event}
        );
        document.querySelector(":root")?.dispatchEvent(browserEvent);
    }

    window.dataLayer.push(event);

    // By default GTM will continue using any dataLayer variables added in
    // a previous event for all events after than one unless that variable
    // is changed. We don't want this to happen except for a few variables
    // where that behaviors is desirable. So we keep a list of variables
    // that we want to be "persistent" and flush the rest every time a new
    // event is triggered.
    const varsToFlush = Object.keys(
        Object.assign({}, ...window.dataLayer)
    ).filter(key => !persistentVars.has(key))

    // If GTM has loaded then flush directly
    if (window.google_tag_manager) {
        for (const key of varsToFlush) {
            window.google_tag_manager[process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID]
                .dataLayer.set(key, undefined)
        }

    // Otherwise add event to flush vars
    } else {
        const eventVarsFlush = {event: "Clear Previous Variables"}

        for (const key of varsToFlush) {
            eventVarsFlush[key] = undefined
        }
        window.dataLayer.push(eventVarsFlush)
    }
}

export const browserEventName = "googletagmanagerevent"

export type GTMEventDirectToGA = {
    event: string,
    eventCat: string,
    eventAction: string | null,
    eventLabel: string | null,
    eventValue?: number | null,
    sendDirectlyToGA: bool,
};
export type GTMEventOther = {
    event: string,
    eventCat?: empty,
    eventAction?: empty,
    eventLabel?: empty,
    eventValue?: empty,
    sendDirectlyToGA?: empty,
};
export type GTMEvent = GTMEventDirectToGA | GTMEventOther;

// $Shape<T> isn't technically equal to T with all property set to optional but
// we're using it that way.
export type AnalyticsEvent = $Shape<GTMEventDirectToGA>

const persistentVars = new Set(["event"])

export function setPersistentVars(varKeys: Array<string>) {
    varKeys.forEach(key => persistentVars.add(key))
}
