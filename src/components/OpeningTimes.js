/* @flow */

import moment from "moment";
import mui from "material-ui";
import React from "react";
import _ from "underscore";

import ScreenReader from "./ScreenReader";
import ServiceOpening from "../iss/ServiceOpening";
import colors from "../constants/theme";
var palette = colors.getPalette();

import icons from '../icons';

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
    var timeFn = function() {return moment(time);};

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
    };
}

class OpeningTimes extends React.Component {

    // flow:disable not supported yet
    static propTypes = {
        object: React.PropTypes.object.isRequired,
        moment: React.PropTypes.function,
    };

    // flow:disable
    static defaultProps = {
        moment: moment,
    };

    // Lots of permutations here because this component has
    // lots of complex logic. Should probably be split into
    // CurrentlyOpen/CurrentlyClosed components to simplify.
    // flow:disable not supported yet
    static sampleProps = {
        open: fixture(true,  [{
            day: "Wednesday",
            open: "10:30:00",
            close: "15:00:00",
        },]),
        "Open for days": fixture(true, [{
            day: "Wednesday",
            open: "00:00:00",
            close: "24:00:00",
        },{
            day: "Thursday",
            open: "00:00:00",
            close: "24:00:00",
        },]),
        closed: fixture(false, [{
            day: "Thursday",
            open: "14:30:00",
            close: "15:00:00",
        },]),
        "Closed for days": fixture(false, [{
            day: "Friday",
            open: "14:30:00",
            close: "15:00:00",
        },]),
        "Open later today": fixture(false, [{
            day: "Wednesday",
            open: "14:30:00",
            close: "15:00:00",
        },]),
        "Open tomorrow morning": fixture(false, [{
            day: "Thursday",
            open: "09:30:00",
            close: "15:00:00",
        },]),
        "Closed earlier today": fixture(false, [{
            day: "Wednesday",
            open: "8:30:00",
            close: "10:00:00",
        },]),
        unsure: fixture(null,  [{
            day: "Wednesday",
            open: "14:30:00",
            close: "15:00:00",
            note: "Every second Wednesday",
        },]),
        "Closed with no data": fixture(false,  []),
        "Open with no data": fixture(true,  []),
        "Unsure with no data": fixture(null,  []),
        invalid: fixture(null,  [{
            day: "Wednesday",
            open: "24:30:00",
            close: "25:00:00",
            note: "Every second Wednesday with invalid times",
        },]),
    };

    /*
     * String templating macro to
     * - Convert moment values to strings
     * - Ensure we aren't displaying invalid or undefined dates
     *
     * If any dates are undefined or invalid, the whole string
     * comes back empty.
     *
     */
    ifTime(strings: Array<string>, ...values: Array<any>): string {
        if (_(values).contains(undefined)) {
            return "";
        }

        var timeValues = values.map(function(v) {
            if (moment.isMoment(v)) {
                return v.format('h:mm A');
            }

            return v;
        });

        if (_(timeValues).contains('Invalid date')) {
            return "";
        }

        // flow:disable doesn't know about raw
        return String.raw(strings, ...timeValues);
    }

    /*
     * Render the opening hours if ISS says it's open
     */
    renderOpen(): React.Element {
        var closesAt = this.props.object.nextCloses;
        return (
            <span className="until">
                <span className="open">
                    Open
                </span> {this.ifTime`until ${closesAt}`}
            </span>
        );
    }

    /*
     * Render the opening hours if ISS says it's closed
     */
    renderClosed(): React.Element {
        var day = "";

        if (this.props.object.nextOpeningTimes) {
            var nextOpen = this.props.object.nextOpeningTimes.start;

            var startToday = this.props.moment().startOf('day');
            var daysAway = moment(nextOpen)
                .startOf('day')
                .diff(startToday, 'days');
            var dayName = nextOpen.format('dddd');
            if (daysAway == 0) {
                day = this.ifTime`today ${nextOpen}`;
            } else if (daysAway == 1) {
                day = this.ifTime`tomorrow ${nextOpen}`;
            } else if (daysAway >= 6) {
                day = this.ifTime`next ${dayName} ${nextOpen}`;
            } else {
                day = this.ifTime`${dayName} ${nextOpen}`;
            }
        }

        return (
            <span className="until">
                <span className="closed">
                    Closed
                </span> {day ? `until ${day}` : ''}
            </span>
        );
    }

    /*
     * Render the opening hours if ISS isn't sure whether
     * the place is currently open.
     */
    renderUnsure(): React.Element {
        var open = this.props.object.nextOpeningTimes;
        if (!open) {
            return (
                <span className="when">
                    Contact for opening hours
                </span>
            );
        }

        var start = this.ifTime`from ${open.start}`;
        var end = this.ifTime`until ${open.end}`;
        return (
            <span className="when">
                { open.day } { start } { end }
                { open.note ? ` (${open.note})` : ''}
            </span>
        );
    }

    render(): React.Element {
        var open = this.props.object.now_open;

        var renderMethod: ?Function;
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
                <icons.Clock className="ColoredIcon brand-text-dark" />
                {' '}
                { renderMethod.apply(this) }
            </div>
        );

    }
}

export default OpeningTimes;
