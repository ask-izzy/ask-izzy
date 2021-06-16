/* @flow */

export function emit(event: AnalyticsEvent): void {
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
                window.google_tag_manager[window.GOOGLE_TAG_MANAGER_ID]
                    .dataLayer.set(key, undefined)
            }
        }
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
            window.google_tag_manager[window.GOOGLE_TAG_MANAGER_ID]
                .dataLayer.set(key, undefined)
        }

    // Otherwise add event to flush vars
    } else {
        const eventVarsFlush = {event: "Flush Vars"}

        for (const key of varsToFlush) {
            eventVarsFlush[key] = undefined
        }
        window.dataLayer.push(eventVarsFlush)
    }
}

export type AnalyticsEvent = {
    event: string,
    eventCat?: string,
    eventAction?: string,
    eventLabel?: string,
    eventValue?: number,
    sendDirectlyToGA?: bool,
};

const persistentVars = new Set(["event"])

export function setPersistentVars(varKeys: Array<string>) {
    varKeys.forEach(key => persistentVars.add(key))
}
