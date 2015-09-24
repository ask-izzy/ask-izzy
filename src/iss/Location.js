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

    streetAddressLine1(): string {
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
