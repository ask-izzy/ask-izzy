/* @flow */
// flow:disable
import React, { useEffect, Fragment } from "react";
import { withRouter } from "react-router-dom";
import storage from "../storage";

function ScrollToTop({ history, children }) {
    let historyLength = storage.getHistoryLength();

    function setHistoryLength(newLength: number): void {
        historyLength = newLength;
        storage.setHistoryLength(newLength);
    }

    useEffect(() => {
        let prevLocation = null
        history.listen((location, action) => {
            if (!prevLocation || location.pathname !== prevLocation.pathname) {
                window.scrollTo(0, 0);
            }

            if (action === "POP") {
                setHistoryLength(historyLength - 1);
            }

            if (action === "PUSH") {
                setHistoryLength(historyLength + 1);
            }

            prevLocation = location
        })
    }, [])

    return <Fragment>{children}</Fragment>;
}

export default withRouter(ScrollToTop);