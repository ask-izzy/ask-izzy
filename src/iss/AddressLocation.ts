/* eslint-disable camelcase */
import _ from "underscore";
import { titleize } from "underscore.string";
import type {geoPoint} from "./general"

export type AddressLocationProps = {
    confidential?: boolean,
    building_name: string,
    flat_unit: string,
    floor_level: string,
    geo_point?: geoPoint | null,
    lga?: string,
    postcode: string,
    state: string,
    street_name: string,
    street_number: string,
    street_suffix: string,
    street_type: string,
    suburb: string,
    // Not part of an ISS location. This is the "location_details" field of
    // the service the location belongs to.
    details?: string | null,
};

export default class AddressLocation {
    confidential?: boolean;
    building_name: string;
    flat_unit: string;
    floor_level: string;
    geo_point?: geoPoint | null;
    lga?: string;
    postcode: string;
    state: string;
    street_name: string;
    street_number: string;
    street_suffix: string;
    street_type: string;
    suburb: string;
    details?: string | null;

    constructor(props: AddressLocationProps) {
        Object.assign(this, props);
    }

    /* If the location is marked as confidential or there is no geo_point
     * value then it's being suppressed. Otherwise, check whether the data
     * includes 'confidential', since older records aren't always marked
     * this way.
     */
    isConfidential(): boolean {
        return Boolean(
            this.confidential ||
            !this.geo_point ||
            allAddressText(this).match(/confidential|secret/i)
        );
    }

    /*
     * Does this record lack a useful street address?
     */
    isSuburbOnly(): boolean {
        return Boolean(
            allAddressText(this).match(/(local ?access)|(no ?street ?access)/i)
        );
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
            this.floor_level,
            this.building_name,
        ].map(text => (text || "").trim());

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

    singleLineStreetAddress(): string {
        return [this.streetAddressLine1(), this.streetAddressLine2()]
            .filter(text => text)
            .join(", ")
    }
}

function allAddressText(location: AddressLocation): string {
    return [
        location.building_name,
        location.flat_unit,
        location.floor_level,
        location.postcode,
        location.state,
        location.street_name,
        location.street_number,
        location.street_suffix,
        location.street_type,
        location.suburb,
        location.details,
    ].join("")
}
