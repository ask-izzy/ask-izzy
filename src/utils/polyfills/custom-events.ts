// Polyfill to make IE11 use the same API for custom events as
// modern browsers.
// Based off: https://stackoverflow.com/a/37566606

export {}

(function() {
    if (
        typeof window === "undefined" ||
        typeof window.CustomEvent === "function"
    ) {
        return false;
    }

    function CustomEvent(event: string, params: CustomEventInit) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined,
        };
        const evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(
            event,
            params.bubbles,
            params.cancelable,
            params.detail,
        );
        return evt;
    }

    CustomEvent.prototype = window.Event;
    // CustomEvent is not defined on the window object
    // https://stackoverflow.com/questions/23920708/
    // get-short-javascript-customevent-polyfill-to-compile-in-typescript
    window.CustomEvent = <any>CustomEvent;
})();
