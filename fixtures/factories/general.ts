import merge from "deepmerge";

import { PhoneNumber } from "./Value";
import type {
    phone,
    nowOpen,
    openingHours,
    travelTime,
} from "../../src/iss/general"

export function getNowOpenFixture(props?: Partial<nowOpen> | null | undefined): nowOpen {
    return merge({
        local_time: "2019-01-03T13:00:05+11:00",
        notes: "",
        now_open: true,
    }, props || {});
}

export function getOpeningHoursFixture(
    props?: Partial<openingHours> | null | undefined
): openingHours {
    return merge({
        day: "Monday",
        open: "09:00:00",
        close: "16:00:00",
        note: "",
    }, props || {});
}

export function getPhoneFixture(props?: Partial<phone> | null | undefined): phone {
    return merge({
        kind: "phone",
        number: PhoneNumber(),
        comment: "",
    }, props || {});
}

export function getTravelTimesFixture(
    props?: Partial<travelTime>
): Array<travelTime> {
    return [
        merge(
            {
                mode: "WALKING",
                status: "OK",
                distance: {text: "100 metres", value: "100"},
                duration: {text: "5 minutes", value: "300"},
            },
            props || {}
        ),
    ];
}
