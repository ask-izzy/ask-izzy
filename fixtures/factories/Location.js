/* @flow */

import { Sequence, Merge } from "./Value";

const streetNo = Sequence();

export function Location(props: ?Object): issLocation {
    return Merge({
        building: "",
        details: "",
        flat_unit: "",
        level: "",
        point: {
            lat: 33.54,
            lon: -141.23,
        },
        postcode: "",
        state: "",
        street_name: "",
        street_number: streetNo(),
        street_suffix: "",
        street_type: "",
        suburb: "",
    }, props);
}

export function TravelTimes(props: ?Object): Array<travelTime> {
    return [Merge({
        mode: "WALKING",
        status: "OK",
        distance: {text: "100 metres", value: "100"},
        duration: {text: "5 minutes", value: "300"},
    }, props)];
}

const siteId = Sequence();

export function Site(props: ?Object): issSite {
    const sId = siteId();
    const oId = siteId();

    return Merge({
        id: sId,
        name: `Home of ${sId}`,
        organisation: {
            id: oId,
            name: `Organization of ${oId}`,
        },
    }, props);
}

const poBox = Sequence();

export function PostalAddress(props: ?Object): issPostalAddress {
    return Merge({
        line1: `PO box ${poBox()}`,
        line2: "",
        postcode: "3121",
        state: "VIC",
        suburb: "Richmond",
    }, props);
}
