import merge from "deepmerge";

import { PhoneNumber } from "./Value";
import type {
    phone,
    openingHours,
    travelTime,
} from "../../src/iss/general"

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
        phone_type: "phone",
        number: PhoneNumber(),
        comment: "",
        confidential: false,
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
