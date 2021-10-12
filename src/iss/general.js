/* @flow */
export type ymdWithDashesDate = string;
export type hmsWithColonsTime = string;
export type isoDateAndTime = string;

export type postalAddress = {
    line1: string,
    line2: string,
    postcode: string,
    state: string,
    suburb: string
};

export type travelTime = {
    duration: {
        text: string,
        value: number
    },
    distance: {
        text: string,
        value: number
    },
    mode: string,
    status: string,
};

export type nowOpen = {
    local_time: isoDateAndTime,
    notes: string,
    now_open: ?boolean
}

export type openingHours = {
    close: hmsWithColonsTime,
    day: dayOfWeek,
    note?: string,
    open: hmsWithColonsTime,
};

export type phone = {
    comment: string,
    kind: string,
    number: string,
}

export type dayOfWeek = 'Monday' |
    'Tuesday' |
    'Wednesday' |
    'Thursday' |
    'Friday' |
    'Saturday' |
    'Sunday' |
    'Public Holiday';

export type geoPoint = {
    lat: number,
    lon: number
}
