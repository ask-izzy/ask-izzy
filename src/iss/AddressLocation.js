/* @flow */
/* eslint-disable camelcase */
import _ from "underscore";
import { titleize } from "underscore.string";
import type {geoPoint} from "./general"

export type AddressLocationProps = {
    location_address_line_1: string,
    location_postcode: string,
    location_suburb: string,
    location_state: string,
    location_confidential: boolean,
    location_geo_point?: {
        latitude: number,
        longitude: number
    },
    location_approximate_geopoint?: {
        latitude: number,
        longitude: number
    },
};
export default class AddressLocation {
    street_name: string;
    postcode: string;
    suburb: string;
    state: string;
    confidential: boolean;
    point: {
        lat: number,
        lon: number
    };

    constructor(props: AddressLocationProps) {
        this.street_name = props.location_address_line_1
        this.postcode = props.location_postcode
        this.suburb = props.location_suburb
        this.state = props.location_state
        this.confidential = props.location_confidential

        if (props.location_geo_point) {
            this.point = {
                lat: props.location_geo_point.latitude,
                lon: props.location_geo_point.longitude,
            }
        } else if (props.location_approximate_geopoint) {
            this.point = {
                lat: props.location_approximate_geopoint.latitude,
                lon: props.location_approximate_geopoint.longitude,
            }
        }
    }

    /* If there is no point value,
     * that means it's being suppressed.
     * Otherwise, check whether the data includes
     * 'confidential', since older records
     * aren't marked this way.
     */
    isConfidential(): boolean {
        return Boolean((
            this.building +
            this.flat_unit +
            this.level +
            this.postcode +
            this.state +
            this.street_name +
            this.street_number +
            this.street_suffix +
            this.street_type +
            this.suburb +
            this.details
        ).match(/confidential|secret/i) || !this.point);
    }

    /*
     * Does this record lack a useful street address?
     */
    isSuburbOnly(): boolean {
        return Boolean((
            this.building +
            this.flat_unit +
            this.level +
            this.postcode +
            this.state +
            this.street_name +
            this.street_number +
            this.street_suffix +
            this.street_type +
            this.suburb +
            this.details
        ).match(/(local ?access)|(no ?street ?access)/i));
    }

    streetAddressLine1(): string {
        if (this.isConfidential()) {
            return "Confidential location";
        }

        if (this.isSuburbOnly()) {
            return "";
        }

        let addrDescriptors = [
            this.flat_unit,
            this.level,
            this.building,
        ].map(text => text.trim());

        // FIXME: find a way to make this way clearer
        addrDescriptors = _(addrDescriptors)
            .compact()
            .map(part => `${part}, `)
            .join("");

        let street = [
            titleize(this.street_number),
            titleize(this.street_name),
            titleize(this.street_type),
            titleize(this.street_suffix),
        ].join(" ").trim();

        return addrDescriptors + street;
    }

    streetAddressLine2(): string {
        if (this.isConfidential()) {
            return this.state;
        }

        return [
            titleize(this.suburb),
            this.state,
            titleize(this.postcode),
        ].join(" ").trim();
    }
}
