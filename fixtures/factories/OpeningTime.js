/* @flow */

import { Merge } from "./Value";

export function NowOpen(props: ?Object): issNowOpen {
    return Merge({
        local_time: "13:00:05",
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
