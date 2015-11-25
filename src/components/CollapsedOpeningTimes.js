/* @flow */

import React from "react";
import moment from "moment";
import _ from "underscore";

import ServiceOpening from "../iss/ServiceOpening";
import Collapser from "./Collapser";
import OpeningTimes from "./OpeningTimes";

function formatTime(str: string): string {
    return moment(str, "HH:mm:ss").format("h:mm A");
}

/*
 * Used to generate sample datum for the Style Guide
 */
function fixture(
    nowOpen: ?boolean,
    openingHours: Array<issOpeningHours>,
    time: ?Moment
): Object {
    // Moment is fixed to Wednesday 15/9/2015 at 1pm
    time = time || moment("2015-09-09 1pm", "YYYY-MM-DD ha");

    const timeFn = () => moment(time);

    return {
        object: new ServiceOpening(
            {
                now_open: {
                    now_open: nowOpen,
                    local_time: "",
                    notes: "",
                },
                opening_hours: openingHours,
            },
            timeFn
        ),
        moment: timeFn,
        expanded: true,
    };
}

export default class CollapsedOpeningTimes extends React.Component {

    static sampleProps = {
        "One opening time": fixture(true, [{
            day: "Wednesday",
            open: "10:30:00",
            close: "15:00:00",
        }]),
        "Two opening times": fixture(true, [{
            day: "Wednesday",
            open: "00:00:00",
            close: "24:00:00",
        }, {
            day: "Thursday",
            open: "00:00:00",
            close: "23:00:00",
        }]),
    };

    render(): ReactElement {
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

        let openingHours = _(this.props.object.openingTimes)
            .sortBy(record => order.indexOf(record.day));

        return (
            <div className="OpeningTimesContainer">
                <OpeningTimes object={this.props.object} />
                {openingHours.length > 1 ?
                    <Collapser
                        className="CollapsedOpeningTimes"
                        message="All times"
                        expanded={this.props.expanded}
                    >
                    <ul>
                    {openingHours.map((record, idx) =>
                        <li key={idx} >
                            <span className="day">{record.day}</span>
                            {' '}
                            <span className="time">
                                {formatTime(record.open)}
                                &ndash;
                                {formatTime(record.close)}
                            </span>
                        </li>
                    )}
                    </ul>
                    </Collapser>
                : ""}
            </div>
        );
    }
}
