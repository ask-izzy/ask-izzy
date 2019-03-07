/* @flow */

import React from "react";
import moment from "moment";
import _ from "underscore";

import ServiceOpening from "../iss/ServiceOpening";
import Collapser from "./Collapser";
import OpeningTimes from "./OpeningTimes";
import sendEvent from "../google-tag-manager";

function formatTime(str: string): string {
    return moment(str, "HH:mm:ss").format("h:mm A");
}

const sampleTime = moment("2015-09-09 1pm", "YYYY-MM-DD ha");

/*
 * Used to generate sample datum for the Style Guide
 */
function fixture(
    nowOpen: ?boolean,
    openingHours: Array<issOpeningHours>,
    time: ?Moment,
    expanded = true,
): Object {
    // Moment is fixed to Wednesday 15/9/2015 at 1pm
    time = time || sampleTime;

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
        expanded: expanded,
    };
}

type Props = {
    object: ServiceOpening,
    serviceId: number,
    moment?: Moment,
    expanded?: boolean,
}

// eslint-disable-next-line max-len
export default class CollapsedOpeningTimes extends React.Component<Props, void> {
    static sampleProps = {
        "between Twice in one day (@1pm wed)": fixture(false, [{
            day: "Wednesday",
            open: "09:00:00",
            close: "11:00:00",
        }, {
            day: "Wednesday",
            open: "16:00:00",
            close: "18:00:00",
        }]),
        "before Twice in one day (@1pm wed)": fixture(false, [{
            day: "Wednesday",
            open: "13:30:00",
            close: "14:00:00",
        }, {
            day: "Wednesday",
            open: "16:00:00",
            close: "18:00:00",
        }]),
        "after Twice in one day (@1pm wed)": fixture(false, [{
            day: "Wednesday",
            open: "01:00:00",
            close: "02:00:00",
        }, {
            day: "Wednesday",
            open: "03:00:00",
            close: "04:00:00",
        }]),
        "With many times": fixture(true, [{
            day: "Wednesday",
            open: "01:00:00",
            close: "02:00:00",
        }, {
            day: "Thursday",
            open: "03:00:00",
            close: "04:00:00",
        }, {
            day: "Friday",
            open: "03:00:00",
            close: "04:00:00",
        }, {
            day: "Monday",
            open: "03:00:00",
            close: "04:00:00",
        }, {
            day: "Tuesday",
            open: "03:00:00",
            close: "04:00:00",
        }], sampleTime, false),
    };

    recordExpandOpeningTimes(): void {
        sendEvent({
            event: "expandOpeningTimes",
            service: this.props.serviceId,
        })
    }

    render() {
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
            .sortBy(record =>
                (order.indexOf(record.day) * 24) +
                (parseInt(record.open))
            );

        return (
            <div className="CollapsedOpeningTimes">
                <OpeningTimes object={this.props.object} />
                {openingHours.length > 0 && (
                    <Collapser
                        message="Open Times"
                        expanded={this.props.expanded}
                        onClick={this.recordExpandOpeningTimes.bind(this)}
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
        );
    }
}
