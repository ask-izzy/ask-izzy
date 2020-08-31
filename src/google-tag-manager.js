/* @flow */

export function emit(event: AnalyticsEvent, gtmId?: string): void {
    // If window isn't defined we're probably testing or generating a static
    // build. So we don't want to be sending analytics.
    if (typeof window === "undefined") {
        return
    }
    getDataLayer(gtmId).push(event)
    // flush variables non-persistent variables
    if (gtmId) {
        const varsToFlush = Object.keys(
            Object.assign({}, ...getDataLayer(gtmId))
        ).filter(key => !persistentVars.has(key))

        // If GTM has loaded then flush directly
        if (window.google_tag_manager && window.google_tag_manager[gtmId]) {
            for (const key of varsToFlush) {
                window.google_tag_manager[gtmId].dataLayer.set(key, undefined)
            }

        // Otherwise add event to flush vars
        } else {
            const eventVarsFlush = {event: "Flush Vars"}

            for (const key of varsToFlush) {
                eventVarsFlush[key] = undefined
            }
            getDataLayer(gtmId).push(eventVarsFlush)
        }
    }
}

export function getDataLayer(gtmId?: string): Array<Object> {
    // If window isn't defined we're probably testing or generating a static
    // build. So we don't want to be sending analytics.
    if (typeof window === "undefined") {
        return []
    }
    gtmId = gtmId || window.GOOGLE_TAG_MANAGER_ID.split("~")[0]
    const key = `dataLayer${gtmId.split("-")[1]}`

    window[key] = window[key] || [];

    return window[key]
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