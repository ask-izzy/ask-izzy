/* @flow */
import React from "react";
import _ from "underscore";
import icons from "../icons";
import { titleize } from "underscore.string";
import ScreenReader from "./ScreenReader";

class Address extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {
        complex: {
            "building": "Hamy building",
            "flat_unit": "Room 35",
            "level": "Level 3",
            "postcode": "3121",
            "state": "VIC",
            "street_name": "Elizabeth",
            "street_number": "33",
            "street_suffix": "",
            "street_type": "St",
            "suburb": "RICHMOND",
        },
    };

    render(): ReactElement {
        var streetParts = [
            this.props.flat_unit,
            this.props.level,
            this.props.building,
        ].map(text => text.trim());
        streetParts = _(streetParts)
            .compact()
            .map(part => `${part}, `)
            .join("");

        var street = [
            titleize(this.props.street_number),
            titleize(this.props.street_name),
            titleize(this.props.street_type),
            titleize(this.props.street_suffix),
        ].join(" ").trim();
        var suburb = [
            titleize(this.props.suburb),
            this.props.state,
            titleize(this.props.postcode),
        ].join(" ").trim();

        var query = encodeURIComponent(`${streetParts} ${street} ${suburb}`);

        return (
            <div className="Address">
                <ScreenReader>
                    <h4>Address</h4>
                </ScreenReader>
                <a
                    target="_blank"
                    aria-label="Open Google Maps in a new tab"
                    href={`https://maps.google.com/?q=${query}`}
                >
                    <icons.Map />
                    <div className="Address-wrapper">
                        {' '}
                        <div className="street">
                            {streetParts}
                            {street}
                        </div>
                        {' '}
                        <div className="suburb">
                            {suburb}
                        </div>
                    </div>
                </a>
            </div>

        );
    }

}

export default Address;
