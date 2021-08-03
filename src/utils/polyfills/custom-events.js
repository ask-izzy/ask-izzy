/* @flow */
// Polyfill to make IE11 use the same API for custom events as
// modern browsers.
// Based off: https://stackoverflow.com/a/37566606

(function() {
    if (
        typeof window === "undefined" ||
        typeof window.CustomEvent === "function"
    ) {
        return false;
    }

    function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined,
        };
        let evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(
            event,
            params.bubbles,
            params.cancelable,
            params.detail
        );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();
