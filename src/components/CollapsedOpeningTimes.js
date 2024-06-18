/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import Collapser from "./general/Collapser";
import CurrentOpeningTime from "./CurrentOpeningTime.js";
import OpeningTimesList from "./OpeningTimesList";
import Service from "../iss/Service";
import OpeningTimes from "./OpeningTimes";
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
    service: Service,
    externalCollapsed?: boolean, // New prop for external control
    onToggle?: (isCollapsed: boolean) => void, // New prop for toggle handling
};

function CollapsedOpeningTimes({ service, externalCollapsed, onToggle }: Props): ReactNode {
    return (
        <div className="CollapsedOpeningTimes">
            <CurrentOpeningTime serviceOpening={service.open} />
            {service.open.openingTimes.length > 0 && (
                <Collapser
                    expandMessage="Show open hours"
                    collapseMessage="Hide open hours" // Add collapse message
                    expandMessage="Show open times"
                    analyticsEvent={{
                        event: `Action Triggered - Opening Times`,
                        eventAction: "Show opening times",
                        eventLabel: null,
                    }}
                    externalCollapsed={externalCollapsed} // Pass externalCollapsed prop
                    onToggle={onToggle} // Pass onToggle prop
                >
                    <div className="AllOpeningTimes">
                        <OpeningTimesList service={service} />
                    </div>

                    <ul className="AllOpeningTimes">
                        {openingHours.map((record, idx) =>
                            <li key={idx}>
                                <span className="day">{record.day}</span>
                                <span className="time">
                                    {formatTime(record.open)}
                                    &ndash;
                                    {formatTime(record.close)}
                                </span>
                                <span className="note">{record.note} </span>
                            </li>
                        )}
                    </ul>
                </Collapser>
            )}
        </div>
    );
}

export default CollapsedOpeningTimes;
