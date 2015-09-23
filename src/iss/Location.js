/* @flow */
import _ from "underscore";
import { titleize } from "underscore.string";

export default class Location {
    props: issLocation;

    constructor(props: issLocation) {
        this.props = props;
    }

    googleMapsUrl(): string {
        var query = encodeURIComponent(
            `${this.streetAddressLine1()} ${this.streetAddressLine2()}`
        );

        return `https://maps.google.com/?q=${query}`;
    }

    /* If there is no point value, that means it's being suppressed */
    isConfidential(): boolean {
        return !Boolean(this.props.point);
    }

    streetAddressLine1(): string {
        if (this.isConfidential()) {
            return "Confidential location";
        }

        var addrDescriptors = [
            this.props.flat_unit,
            this.props.level,
            this.props.building,
        ].map(text => text.trim());

        addrDescriptors = _(addrDescriptors)
            .compact()
            .map(part => `${part}, `)
            .join("");

        var street = [
            titleize(this.props.street_number),
            titleize(this.props.street_name),
            titleize(this.props.street_type),
            titleize(this.props.street_suffix),
        ].join(" ").trim();

        return addrDescriptors + street;
    }

    streetAddressLine2(): string {
        return [
            titleize(this.props.suburb),
            this.props.state,
            titleize(this.props.postcode),
        ].join(" ").trim();
    }

}
