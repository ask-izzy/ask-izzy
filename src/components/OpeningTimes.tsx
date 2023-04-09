import React, {ReactElement} from "react"

import ServiceOpening from "@/src/iss/ServiceOpening.js"
import ScreenReader from "@/src/components/ScreenReader.js"
import Clock from "@/src/icons/Clock.js"


type Props = {
    object: ServiceOpening,
}

function OpeningTimes({
    object,
}: Props) {

    const open = object.now_open
    let renderMethod: () => void

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
                    {object.until}
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
                    {object.until}
                </span>
            </span>
        )
    }

    /*
     * Render the opening hours if ISS isn't sure whether
     * the place is currently open.
     */
    function renderUnsure(): ReactElement<"span"> {
        const openTime = object.nextOpeningTimes

        if (!openTime) {
            return (
                <span className="until">
                    Contact for opening hours.
                </span>
            )
        }

        const start = object.ifTime(["from ", ""], openTime.start)
        const end = object.ifTime(["until ", ""], openTime.end)

        return (
            <span className="until">
                {openTime.day} {start} {end}
                {openTime.note && ` (${openTime.note})`}
            </span>
        )
    }

    return (
        <div className="OpeningTimes">
            <Clock
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

export default OpeningTimes
