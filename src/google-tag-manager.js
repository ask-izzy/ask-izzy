/* @flow */

export default function push(event: Object, gtmId?: string): void {
    gtmId = gtmId || window.GOOGLE_TAG_MANAGER_ID.split("~")[0]
    const key = `dataLayer${gtmId.split("-")[1]}`

    if (typeof window != "undefined") {
        window[key] = window[key] || [];
        window[key].push(event);
    }
}
