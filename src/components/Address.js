/* @flow */
import React from "react";
import fixtures from "../../fixtures/services";
import icons from "../icons";
import { titleize } from "underscore.string";

class Address extends React.Component {

    // flow:disable not supported yet
    static sampleProps = fixtures.ixa.location;

    describe(property: string, description: string): React.Element {
        var described = "";
        if (this.props[property]) {
            described = `${description} ${this.props[property]}`;
        }

        return <span className={property} >{described}</span>;
    }

    render(): React.Element {

        return (
            <div className="Address">
                <icons.Map />
                <div className="Address-wrapper">

                    <div className="street">
                        { this.describe('level', 'Level') }
                        {' '}
                        { this.describe('unit', 'Unit') }
                        {' '}
                        { this.describe('building', '') }
                        {' '}
                        { titleize(this.props.street_number) }
                        {' '}
                        { titleize(this.props.street_name) }
                        {' '}
                        { titleize(this.props.street_type) }
                        {' '}
                        { titleize(this.props.street_suffix) }
                    </div>
                    <div className="suburb">
                        { titleize(this.props.suburb) }
                        {' '}
                        { titleize(this.props.state) }
                        {' '}
                        { titleize(this.props.postcode) }
                    </div>
                </div>
            </div>
        );
    }

}

export default Address;
