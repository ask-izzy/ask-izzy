/* @flow */
import React from "react";
import fixtures from "../../fixtures/services";
import icons from "../icons";

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
                <div className="street">
                    {this.describe('level', 'Level')}
                    {' '}
                    {this.describe('unit', 'Unit')}
                    {' '}
                    {this.describe('building', '')}
                    {' '}
                    {this.props.street_number}
                    {' '}
                    {this.props.street_name}
                    {' '}
                    {this.props.street_type}
                    {' '}
                    {this.props.street_suffix}
                </div>
                <div className="suburb">
                    {this.props.suburb}
                    {' '}
                    {this.props.state}
                    {' '}
                    {this.props.postcode}
                </div>

            </div>
        );
    }

}

export default Address;
