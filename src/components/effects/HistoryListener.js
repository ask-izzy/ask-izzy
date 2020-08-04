/* @flow */
import storage from "../../storage";
import { withRouter } from "react-router";
// $FlowIgnore flowjs needs to be updated to include useEffect
import { useEffect } from "react";
import sendEvent from "../../google-tag-manager";
import posthog from "../../utils/posthog";

function historyListener(history) {
    // Override the goBack function for the history object to navigate to
    // the home page if going to the previous page will take the user off
    // Ask Izzy
    const originalGoBackFunc = history.goBack;

    history.goBack = () => {
        storage.getHistoryLength() > 0 ?
            originalGoBackFunc()
            : history.push("/")
    }

    // Initial page view
    sendEvent({
        event: "Page Viewed",
    });
    if (posthog.posthogShouldBeLoaded) {
        posthog.client.capture("$pageview");
    }

    history.listen((location, action) => {
        window.scrollTo(0, 0);

        // Since Ask Izzy is a SPA we need to manually register each
        // new page view
        sendEvent({
            event: "Page Viewed",
        });
        if (posthog.posthogShouldBeLoaded) {
            posthog.client.capture("$pageview");
        }

        // Track size of history stack while navigating Ask Izzy so we know if
        // the previous page is part of ask izzy or not.
        let historyLengthDelta = 0

        if (action === "POP") {
            historyLengthDelta = -1;
        } else if (action === "PUSH") {
            historyLengthDelta = 1;
        }

        if (historyLengthDelta) {
            storage.setHistoryLength(
                storage.getHistoryLength() +
                historyLengthDelta
            )
        }
    });
}

export default withRouter(({history}) => {
    // withRouter will re-render on every location change but we only need to
    // setup listener once
    useEffect(() => historyListener(history), []);
    return null;
})