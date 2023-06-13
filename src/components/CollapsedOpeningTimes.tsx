import React from "react";
import moment from "moment-timezone";
import _ from "underscore";

import ServiceOpening from "@/src/iss/ServiceOpening.js";
import Collapser from "@/src/components/general/Collapser.js";
import OpeningTimes from "@/src/components/OpeningTimes.js";
import type {openingHours as openingHoursType} from "../iss/general.js";

function formatTime(str: string): string {
    return moment(str, "HH:mm:ss").format("h:mm A");
}

const sampleTime = moment("2015-09-09 1pm", "YYYY-MM-DD ha");

/*
 * Used to generate sample datum for the Style Guide
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fixture(
    nowOpen: boolean | null,
    openingHours: Array<openingHoursType>,
    time: Moment | null,
): Record<string, unknown> {
    // Moment is fixed to Wednesday 15/9/2015 at 1pm
    time = time || sampleTime;

    const timeFn = () => moment(time);

    return {
        object: new ServiceOpening(
            {
                now_open: {
                    now_open: nowOpen,
                    local_time: timeFn().format(),
                    notes: "",
                },
                opening_hours: openingHours,
            },
        ),
        moment: timeFn,
    };
}

type Props = {
    object: ServiceOpening,
}

function CollapsedOpeningTimes({
    object,
}: Props) {
    const order = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "Public Holiday",
    ];

    const openingHours = _(object.openingTimes)
        .sortBy(record =>
            (order.indexOf(record.day) * 24) +
            (parseInt(record.open)),
        )

    return (
        <div className="CollapsedOpeningTimes">
            <OpeningTimes object={object} />
            {openingHours.length > 0 && (
                <Collapser
                    expandMessage="Show open hours"
                    analyticsEvent={{
                        event: `Action Triggered - Opening Times`,
                        eventAction: "Show opening times",
                        eventLabel: null,
                    }}
                >
                    <ul className="AllOpeningTimes">
                        {openingHours.map((record, idx) =>
                            <li key={idx} >
                                <span className="day">{record.day}</span>
                                {" "}
                                <span className="time">
                                    {formatTime(record.open)}
                                    &ndash;
                                    {formatTime(record.close)}
                                </span>
                            </li>,
                        )}
                    </ul>
                </Collapser>
            )}
        </div>
    )
}

export default CollapsedOpeningTimes
