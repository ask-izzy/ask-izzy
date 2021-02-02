/* @flow */
import React from "react";
import Map from "../icons/map.svg";
import ScreenReader from "./ScreenReader";
import Location from "../iss/Location";

type Props = {
    location: Location
}

class Address extends React.Component<Props, void> {
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

    render() {
        let location = this.props.location;

        return (
            <div className="Address">
                <ScreenReader>
                    <h4>Address</h4>
                </ScreenReader>
                <Map />
                <div className="Address-wrapper">
                    {" "}
                    <div className="street">
                        {location.streetAddressLine1()}
                    </div>
                    {" "}
                    <div className="suburb">
                        {location.streetAddressLine2()}
                    </div>
                    {" "}
                    {location.details &&
                        <div className="details">
                            {location.details}
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Address;
