/* @flow */


import type {Node as ReactNode} from "React";
import React from "react";
import moment from "moment-timezone";
import _ from "underscore";

import ServiceOpening from "../iss/ServiceOpening";
import Collapser from "./general/Collapser";
import OpeningTimes from "./OpeningTimes";
import * as gtm from "../google-tag-manager";
import type {openingHours as openingHoursType} from "../iss/general";

function formatTime(str: string): string {
    return moment(str, "HH:mm:ss").format("h:mm A");
}

const sampleTime = moment("2015-09-09 1pm", "YYYY-MM-DD ha");

/*
 * Used to generate sample datum for the Style Guide
 */
/* eslint-disable no-unused-vars */
function fixture(
    nowOpen: ?boolean,
    openingHours: Array<openingHoursType>,
    time: ?Moment,
): Object {
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
            }
        ),
        moment: timeFn,
    };
}

type Props = {
    object: ServiceOpening,
    serviceId: number,
    moment?: Moment,
}


function CollapsedOpeningTimes({
    object,
    serviceId,
    moment,
}: Props):ReactNode {
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

    let openingHours = _(object.openingTimes)
        .sortBy(record =>
            (order.indexOf(record.day) * 24) +
            (parseInt(record.open))
        )

    function recordExpandOpeningTimes(): void {
        gtm.emit({
            event: "Opening Times Expanded",
            eventCat: "Content Expanded",
            eventAction: "Opening Times",
            eventLabel: location.pathname,
            sendDirectlyToGA: true,
        })
    }

    return (
        <div className="CollapsedOpeningTimes">
            <OpeningTimes object={object} />
            {openingHours.length > 0 && (
                <Collapser
                    expandMessage="Show open hours"
                    onClick={recordExpandOpeningTimes}
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
                            </li>
                        )}
                    </ul>
                </Collapser>
            )}
        </div>
    )
}

export default CollapsedOpeningTimes
