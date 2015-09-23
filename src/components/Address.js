/* @flow */
import React from "react";
import fixtures from "../../fixtures/services";
import icons from "../icons";
import { titleize } from "underscore.string";
import ScreenReader from "./ScreenReader";

class Address extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        street_number: React.PropTypes.String,
        street_name: React.PropTypes.String,
        street_type: React.PropTypes.String,
        street_suffix: React.PropTypes.String,
        suburb: React.PropTypes.String,
        state: React.PropTypes.String,
        postcode: React.PropTypes.String,
        isConfidential: React.PropTypes.Boolean,
    };

    // flow:disable not supported yet
    static sampleProps = {default: fixtures.ixa.location};

    /*
     * Convert a property to a description
     * (eg `level: 1` -> "Level 1")
     */
    describe(property: string, description: string): string {
        if (this.props[property]) {
            return `${description} ${this.props[property]}`;
        }

        return "";
    }

    render(): ReactElement {

        var suburb = [
            titleize(this.props.suburb),
            this.props.state,
            titleize(this.props.postcode),
        ].join(" ").trim();

        if (this.props.isConfidential) {
            return (
                    <div className="Address">
                        <ScreenReader>
                            <h4>Address</h4>
                        </ScreenReader>
                        <div className="Address-wrapper">
                            {' '}
                            <div className="street">
                                Confidential location
                            </div>
                            {' '}
                            <div className="suburb">
                                {suburb}
                            </div>
                        </div>
                    </div>
                    );
        }

        // Not confidential - describe street & have link to map

        var street = [
            this.describe("level", "Level"),
            this.describe("unit", "Unit"),
            this.describe("building", ""),
            titleize(this.props.street_number),
            titleize(this.props.street_name),
            titleize(this.props.street_type),
            titleize(this.props.street_suffix),
        ].join(" ").trim();

        var query = encodeURIComponent(`${street} ${suburb}`);

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
