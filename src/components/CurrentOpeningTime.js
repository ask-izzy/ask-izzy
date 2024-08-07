/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React"
import React from "react"

import ServiceOpening from "../iss/ServiceOpening"
import ScreenReader from "./ScreenReader"

import {AccessTimeFilled} from "@mui/icons-material";

type Props = {
    serviceOpening: ServiceOpening,
}

function CurrentOpeningTime({serviceOpening}: Props): ReactNode {

    let open = serviceOpening.now_open
    let renderMethod: ?Function

    if (open === true) {
        renderMethod = renderOpen
    } else if (open === false) {
        renderMethod = renderClosed
    } else {
        renderMethod = renderUnsure
    }

    /*
     * Render the opening hours if ISS says it's open
     */
    function renderOpen(): ReactElement<"span"> {
        return (
            <span className="until">
                <span className="open">
                    Open now
                </span>
                {" "}
                <span className="time">
                    {serviceOpening.until}
                </span>
            </span>
        )
    }

    /*
     * Render the opening hours if ISS says it's closed
     */
    function renderClosed(): ReactElement<"span"> {
        return (
            <span className="until">
                <span className="closed">
                    Closed
                </span>
                {" "}
                <span className="time">
                    {serviceOpening.until}
                </span>
            </span>
        )
    }

    /*
     * Render the opening hours if ISS isn't sure whether
     * the place is currently open.
     */
    function renderUnsure(): ReactElement<"span"> {
        const openTime = serviceOpening.nextOpeningTimes

        if (!openTime) {
            return (
                <span className="until">
                    Contact for opening hours.
                </span>
            )
        }

        const start = serviceOpening.ifTime`from ${openTime.start}`
        const end = serviceOpening.ifTime`until ${openTime.end}`

        return (
            <span className="until">
                {openTime.day} {start} {end}
                {openTime.note && ` (${openTime.note})`}
            </span>
        )
    }

    return (
        <div className="CurrentOpeningTime">
            <AccessTimeFilled
                className="ColoredIcon"
                aria-hidden={true}
            />
            <ScreenReader>
                Service is currently
            </ScreenReader>
            {renderMethod.apply(this)}
        </div>
    )
}

export default CurrentOpeningTime
