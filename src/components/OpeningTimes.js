/* @flow */

import React from "react";
import moment from "moment-timezone";

import ScreenReader from "./ScreenReader";
import ServiceOpening from "../iss/ServiceOpening";

import icons from "../icons";

/*
 * Used to generate sample datum for the Style Guide
 */
function fixture(
    nowOpen: ?boolean,
    openingHours: Array<issOpeningHours>,
    time: ?typeof moment.Moment
): Object {
    // Moment is fixed to Wednesday 15/9/2015 at 1pm
    time = time || moment("2015-09-09 1pm", "YYYY-MM-DD ha");

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
    moment?: Moment,
    object: ServiceOpening,
}

class OpeningTimes extends React.Component<Props, void> {
    static defaultProps = {
        moment: moment,
    };

    // Lots of permutations here because this component has
    // lots of complex logic. Should probably be split into
    // CurrentlyOpen/CurrentlyClosed components to simplify.
    static sampleProps = {
        open: fixture(true, [{
            day: "Wednesday",
            open: "10:30:00",
            close: "15:00:00",
        }]),
        "Open for days": fixture(true, [{
            day: "Wednesday",
            open: "00:00:00",
            close: "24:00:00",
        }, {
            day: "Thursday",
            open: "00:00:00",
            close: "24:00:00",
        }]),
        closed: fixture(false, [{
            day: "Thursday",
            open: "14:30:00",
            close: "15:00:00",
        }]),
        "Closed for days": fixture(false, [{
            day: "Friday",
            open: "14:30:00",
            close: "15:00:00",
        }]),
        "Open later today": fixture(false, [{
            day: "Wednesday",
            open: "14:30:00",
            close: "15:00:00",
        }]),
        "Open tomorrow morning": fixture(false, [{
            day: "Thursday",
            open: "09:30:00",
            close: "15:00:00",
        }]),
        "Closed earlier today": fixture(false, [{
            day: "Wednesday",
            open: "8:30:00",
            close: "10:00:00",
        }]),
        unsure: fixture(null, [{
            day: "Wednesday",
            open: "14:30:00",
            close: "15:00:00",
            note: "Every second Wednesday",
        }]),
        "Closed with no data": fixture(false, []),
        "Open with no data": fixture(true, []),
        "Unsure with no data": fixture(null, []),
        invalid: fixture(null, [{
            day: "Wednesday",
            open: "24:30:00",
            close: "25:00:00",
            note: "Every second Wednesday with invalid times",
        }]),
    };

    render() {
        let open = this.props.object.now_open;
        let renderMethod: ?Function;

        if (open === true) {
            renderMethod = this.renderOpen;
        } else if (open === false) {
            renderMethod = this.renderClosed;
        } else {
            renderMethod = this.renderUnsure;
        }

        return (
            <div className="OpeningTimes">
                <ScreenReader>
                    <h4>Opening times</h4>
                </ScreenReader>
                <icons.Clock className="ColoredIcon" />
                {" "}
                <span className="print-only">Open Times</span>
                {renderMethod.apply(this)}
            </div>
        );

    }

    /*
     * Render the opening hours if ISS says it's open
     */
    renderOpen() {
        return (
            <span className="until">
                <span className="open">
                    Open now
                </span>
                {" "}
                <span className="time">
                    {this.props.object.until}
                </span>
            </span>
        );
    }

    /*
     * Render the opening hours if ISS says it's closed
     */
    renderClosed() {
        return (
            <span className="until">
                <span className="closed">
                    Closed
                </span>
                {" "}
                <span className="time">
                    {this.props.object.until}
                </span>
            </span>
        );
    }

    /*
     * Render the opening hours if ISS isn't sure whether
     * the place is currently open.
     */
    renderUnsure() {
        const openTime = this.props.object.nextOpeningTimes;

        if (!openTime) {
            return (
                <span className="until">
                    Contact for opening hours
                </span>
            );
        }

        const start = this.props.object.ifTime`from ${openTime.start}`;
        const end = this.props.object.ifTime`until ${openTime.end}`;

        return (
            <span className="until">
                {openTime.day} {start} {end}
                {openTime.note && ` (${openTime.note})`}
            </span>
        );
    }
}

export default OpeningTimes;
