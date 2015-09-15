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

function timeOfDay(day: Moment, time: string): Moment {
    return moment(
        day.format("YYYY-MM-DD") +
        ' ' + time,
        'YYYY-MM-DD HH:mm:ss'
    );
}

export default class ServiceOpening {
    now_open: ?boolean;
    _opening_times: Array<serviceOpeningHours>;
    _closing_times: Array<serviceOpeningHours>;
    constructor(properties: props, now=moment) {
        this.now_open = properties.now_open.now_open;

        var startOfToday = moment(now()).startOf('day');

        // Turn opening_hours into a sorted list
        // so that we can scan forwards from the first one
        // and only find moment()s which are in the future
        var openingTimes = [];
        var closingTimes = [];
        for (var i = 0; i < properties.opening_hours.length; i++) {
            var oh: issOpeningHours = properties.opening_hours[i];

            // Convert (eg) 'Monday' to a Moment()
            var day = moment(now());
            day = day.day(oh.day);
            var close = timeOfDay(day, oh.close);
            var open = timeOfDay(day, oh.open);

            // split opening / closing hours into separate arrays?
            if (close.isBefore(moment(now()))) {
                close.add(1, 'weeks');
            }

            if (open.isBefore(moment(now()))) {
                open.add(1, 'weeks');
            }

            /* flow:disable */
            var serviceOpeningHours = Object.assign({
                start: open,
                end: close,
            }, oh);

            openingTimes[open.diff(now(), 'days')] = serviceOpeningHours;
            closingTimes[close.diff(now(), 'days')] = serviceOpeningHours;
        }

        this._opening_times = _.compact(openingTimes);
        this._closing_times = _.compact(closingTimes);
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
