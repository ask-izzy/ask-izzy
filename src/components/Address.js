/* @flow */
import React from "react";
import icons from "../icons";
import ScreenReader from "./ScreenReader";
import GoogleMapsLink from "./GoogleMapsLink";
import Location from "../iss/Location";

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
    };

    // flow:disable not supported yet
    static sampleProps = {
        complex: {
            location: new Location({
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
                "point": {},
            }),
        },
        hidden: {
            location: new Location({
                "postcode": "3121",
                "state": "VIC",
                "suburb": "RICHMOND",
                "point": undefined,
            }),
        },
    };

    render(): ReactElement {
        var location = this.props.location;

        // FIXME: GoogleMapsLink should be a slide out static map
        return (
            <div className="Address">
                <ScreenReader>
                    <h4>Address</h4>
                </ScreenReader>
                <GoogleMapsLink to={location}>
                    <icons.Map />
                    <div className="Address-wrapper">
                        {' '}
                        <div className="street">
                            {location.streetAddressLine1()}
                        </div>
                        {' '}
                        <div className="suburb">
                            {location.streetAddressLine2()}
                        </div>
                    </div>
                </GoogleMapsLink>
            </div>
        );
    }

}

export default Address;
