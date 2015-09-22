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
    var [h, m, s] = time.split(":").map((s) => parseInt(s));

    var t = moment(day);

    t.set("hour", h);
    t.set("minute", m);
    t.set("second", s);
    return t;
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
        var openingTimes = [];
        var closingTimes = [];

        for (var openingHours of properties.opening_hours) {
            // Convert (eg) 'Monday' to a Moment()
            var day = moment(now())
                .day(openingHours.day);
            var close = timeOfDay(day, openingHours.close);
            var open = timeOfDay(day, openingHours.open);

            // split opening / closing hours into separate arrays?
            if (close.isBefore(moment(now()))) {
                close.add(1, "weeks");
            }

            if (open.isBefore(moment(now()))) {
                open.add(1, "weeks");
            }

            var serviceOpeningHours = Object.assign({}, {
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
