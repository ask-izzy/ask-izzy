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

    constructor(properties: props, now = moment) {
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

            openingTimes[open.diff(now(), "days")] = serviceOpeningHours;
            closingTimes[close.diff(now(), "days")] = serviceOpeningHours;
        }

        this._opening_times = _.compact(openingTimes);
        this._closing_times = _.compact(closingTimes);
    }

    // flow:disable
    get openingTimes(): Array<openingHours> {
        return this._opening_times;
    }

    // Is it open now?
    // null indicates "we don't know"
    /* flow:disable */
    get open(): ?boolean {
        return this.now_open;
    }

    // When it next opens, when does it open/close?
    /* flow:disable */
    get nextOpeningTimes(): ?openingHours {
        return this._opening_times[0];
    }

    // At what time will it next close?
    /* flow:disable */
    get nextCloses(): ?Moment {
        return (this._closing_times[0] || {}).end;
    }

}
