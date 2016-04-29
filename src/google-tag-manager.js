/* @flow */

export default function push(event: Object): void {
    if (typeof window != "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(event);
    }
}
