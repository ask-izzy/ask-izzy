/* eslint-disable camelcase */
import _ from "underscore";
import _string from "underscore.string";
const { titleize } = _string;

import type {geoPoint} from "@/src/iss/general"

export type AddressLocationProps = {
    building: string,
    details?: string,
    flat_unit: string,
    level: string,
    point?: geoPoint,
    postcode: string,
    state: string,
    street_name: string,
    street_number: string,
    street_suffix: string,
    street_type: string,
    suburb: string,
};
export default class AddressLocation {
    building: string;
    flat_unit: string;
    level: string;
    point: {
        "lat": number,
        "lon": number
    };
    postcode: string;
    state: string;
    street_name: string;
    street_number: string;
    street_suffix: string;
    street_type: string;
    suburb: string;
    details: string;

    constructor(props: AddressLocationProps) {
        Object.assign(this, props);
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

        const street = [
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

    singleLineStreetAddress(): string {
        return [this.streetAddressLine1(), this.streetAddressLine2()]
            .filter(text => text)
            .join(", ")
    }
}
