export type hmsWithColonsTime = string;

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

export type openingHours = {
    close: hmsWithColonsTime,
    day: dayOfWeek,
    note?: string | null,
    open: hmsWithColonsTime,
};

export type phone = {
    comment: string,
    phone_type: string,
    number: string,
    confidential?: boolean,
}

export type email = {
    comment: string,
    email: string,
    confidential?: boolean,
}

export type socialMedia = {
    type: string,
    url: string,
    comment?: string | null,
}

export type language = {
    id: number,
    name: string,
}

export type dayOfWeek = "Monday" |
    "Tuesday" |
    "Wednesday" |
    "Thursday" |
    "Friday" |
    "Saturday" |
    "Sunday" |
    "Public Holiday";

export type geoPoint = {
    lat: number,
    lon: number
}
