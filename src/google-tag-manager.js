/* @flow */

export function emit(event: AnalyticsEvent): void {
    if (typeof window === "undefined") {
        return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);

    // flush non-persistent variables
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
