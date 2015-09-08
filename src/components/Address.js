/* @flow */
import React from "react";
import fixtures from "../../fixtures/services";
import icons from "../icons";
import { titleize } from "underscore.string";

class Address extends React.Component {

    // flow:disable not supported yet
    static sampleProps = fixtures.ixa.location;

    describe(property: string, description: string): string {
        if (this.props[property]) {
            return `${description} ${this.props[property]}`;
        }

        return "";
    }

    render(): React.Element {
        var street = [
            this.describe('level', 'Level'),
            this.describe('unit', 'Unit'),
            this.describe('building', ''),
            titleize(this.props.street_number),
            titleize(this.props.street_name),
            titleize(this.props.street_type),
            titleize(this.props.street_suffix),
        ].join(' ').trim();

        var suburb = [
            titleize(this.props.suburb),
            titleize(this.props.state),
            titleize(this.props.postcode),
        ].join(' ').trim();

        var query = encodeURIComponent(`${street} ${suburb}`);

        return (
            <a
                className="Address"
                target="_blank"
                href={`https://maps.google.com/?q=${query}`}
            >
                <icons.Map />
                <div className="Address-wrapper">
                    <div className="street">
                        { street }
                    </div>
                    {' ' /* so tests can use normalize-whitespace */}
                    <div className="suburb">
                        { suburb }
                    </div>
                </div>
            </a>
        );
    }

}

export default Address;
