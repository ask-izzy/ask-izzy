/* @flow */
import React from "react";
import Location from "../iss/Location";
import * as factory from "../../fixtures/factories/Location";
import GoogleMapsLink from "./GoogleMapsLink";

declare var GOOGLE_KEY: string;

class Address extends React.Component {
    static propTypes = {
        location: React.PropTypes.object,
    };

    static sampleProps = {
        default: {
            location: new Location(factory.Location({
                "postcode": "3121",
                "state": "VIC",
                "street_name": "Elizabeth",
                "street_number": "33",
                "street_suffix": "",
                "street_type": "St",
                "suburb": "RICHMOND",
            })),
        },
    };

    render(): ReactElement {
        const baseUrl = "https://maps.googleapis.com/maps/api/staticmap";
        const apiKey = GOOGLE_KEY;
        const address = `${
            this.props.location.streetAddressLine1()
        } ${
            this.props.location.streetAddressLine2()
        }`;

        let size;

        try {
            size = Math.min(window.innerWidth, 800) - 30;
        } catch (error) {
            size = 640;
        }

        const options = {
            markers: address,
            size: `${size}x${size}`,
            key: apiKey,
            scale: "2",
        };
        const urlParams = Object.keys(options).map((key) =>
            `${key}=${encodeURIComponent(options[key])}`
        ).join("&");

        return (
            <GoogleMapsLink
                to={this.props.location}
                className="StaticMap"
            >
                <img
                    alt={`Map`}
                    src={`${baseUrl}?${urlParams}`}
                />
            </GoogleMapsLink>

        );
    }

}

export default Address;
