/* @flow */
import moment from "moment";
import _ from "underscore";

type props = {
    now_open: {
        local_time: hmsWithColonsTime,
        notes: string,
        now_open: ?boolean,
    },
    opening_hours: Array<issOpeningHours>,
};

type serviceOpeningHours = {
    "day": dayOfWeek,
    "note": string,
    "close": hmsWithColonsTime,
    "end": Moment,
    "open": hmsWithColonsTime,
    "start": Moment,
}

/*
 * Return a new moment on the same day as `day`, but
 * with the time set to `time` which is formatted 'hh:mm:ss'
 */
function timeOfDay(day: Moment, time: hmsWithColonsTime): Moment {
    // Can't just map(parseInt) as parseInt has an optional radix param
    let [hour, mins, secs] = time.split(":").map(str => parseInt(str));

    let time_ = moment(day);

    time_.set("hour", hour);
    time_.set("minute", mins);
    time_.set("second", secs);

    return time_;
}

export default class ServiceOpening {
    now_open: ?boolean;
    _opening_times: Array<serviceOpeningHours>;
    _closing_times: Array<serviceOpeningHours>;
    _now: Moment;

    constructor(properties: props, now: () => Moment = moment) {
        this.now_open = properties.now_open.now_open;

        // Turn opening_hours into a sorted list
        // so that we can scan forwards from the first one
        // and only find moment()s which are in the future
        let openingTimes = [];
        let closingTimes = [];

        for (let openingHours of properties.opening_hours) {
            // Convert (eg) 'Monday' to a Moment()
            let day = moment(now())
                .day(openingHours.day);
            let close = timeOfDay(day, openingHours.close);
            let open = timeOfDay(day, openingHours.open);

            // split opening / closing hours into separate arrays?
            if (close.isBefore(moment(now()))) {
                close.add(1, "weeks");
            }

            if (open.isBefore(moment(now()))) {
                open.add(1, "weeks");
            }

            let serviceOpeningHours = Object.assign({}, {
                start: open,
                end: close,
            }, openingHours);

            openingTimes.push(serviceOpeningHours)
            closingTimes.push(serviceOpeningHours)
        }

        this._now = now();
        this._opening_times = _.sortBy(openingTimes, ({start}) =>
            start.diff(now(), "minutes"));
        this._closing_times = _.sortBy(closingTimes, ({end}) =>
            end.diff(now(), "minutes"));
    }

    get openingTimes(): Array<serviceOpeningHours> {
        return this._opening_times;
    }

    // Is it open now?
    // null indicates "we don't know"
    get open(): ?boolean {
        return this.now_open;
    }

    // When it next opens, when does it open/close?
    get nextOpeningTimes(): ?serviceOpeningHours {
        return this._opening_times[0];
    }

    // At what time will it next close?
    get nextCloses(): ?Moment {
        return (this._closing_times[0] || {}).end;
    }

    // Describes how long the current open state will continue
    get until(): string {
        if (this.now_open) {
            // Service is open
            return this.ifTime`until ${this.nextCloses}`
        } else if (this.now_open === false) {
            // Service is closed
            let nextOpeningTimes = this.nextOpeningTimes;

            if (!nextOpeningTimes) {
                return "";
            } else {
                const nextOpen = nextOpeningTimes.start;
                const startToday = this._now.startOf("day");
                const daysAway = nextOpeningTimes.start.clone()
                    .startOf("day")
                    .diff(startToday, "days");
                const dayName = nextOpeningTimes.start.format("dddd");

                if (daysAway == 0) {
                    return this.ifTime`until today ${nextOpen}`;
                } else if (daysAway == 1) {
                    return this.ifTime`until tomorrow ${nextOpen}`;
                } else if (daysAway >= 6) {
                    return this.ifTime`until next ${dayName} ${nextOpen}`;
                } else {
                    return this.ifTime`until ${dayName} ${nextOpen}`;
                }
            }
        } else {
            // ISS isn't sure whether it's open
            const openTime = this.nextOpeningTimes;

            if (openTime) {
                const start = this.ifTime`from ${openTime.start}`;
                const end = this.ifTime`until ${openTime.end}`;

                return `${start} ${end}`;
            }

            return "";
        }
    }

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

        // Reject invalid dates
        if (_(values).any(
            value => moment.isMoment(value) && !value.isValid())
           ) {
            return "";
        }

        let timeValues = values.map(value => {
            if (moment.isMoment(value)) {
                return value.format("h:mm A");
            }

            return value;
        });

        // flow:disable doesn't know about raw
        return String.raw(strings, ...timeValues);
    }

}
