import merge from "deepmerge";
import {$Shape} from "utility-types";


import {Sequence} from "@/fixtures/factories/Value.js";
import AddressLocation from "@/src/iss/AddressLocation.js";
import type {AddressLocationProps} from "@/src/iss/AddressLocation.js";



const streetNo = Sequence();

export default function getLocationFixture(
    additionalProps?: $Shape<AddressLocationProps>,
): AddressLocation {
    const props = getAddressLocationPropsFixture(additionalProps)
    return new AddressLocation(props);
}

export function getAddressLocationPropsFixture(
    props?: $Shape<AddressLocationProps>,
): AddressLocationProps {
    return merge({
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
    }, props || {});
}
