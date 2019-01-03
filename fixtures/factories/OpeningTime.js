/* @flow */

import { Merge } from "./Value";

export function NowOpen(props: ?Object): issNowOpen {
    return Merge({
        local_time: "2019-01-03T13:00:05+11:00",
        notes: "",
        now_open: true,
    }, props);
}

export function OpeningHours(props: ?Object): issOpeningHours {
    return Merge({
        day: "Monday",
        open: "09:00:00",
        close: "16:00:00",
        note: "",
    }, props);
}
