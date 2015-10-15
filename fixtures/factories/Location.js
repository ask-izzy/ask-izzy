/* @flow */

import { Sequence, Merge } from "./Value";

const streetNo = Sequence();

export function Location(props: ?Object): issLocation {
    return Merge({
        building: "",
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

const siteId = Sequence();

export function Site(props: ?Object) {
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

export function PostalAddress(props: ?Object) {
    return Merge({
        line1: `PO box ${poBox()}`,
        line2: "",
        postcode: "3121",
        state: "VIC",
        suburb: "Richmond",
    }, props);
}
