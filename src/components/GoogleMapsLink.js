/* @flow */
import React from "react";
import fixtures from "../../fixtures/services";
import Location from "../iss/Location";
import classnames from "classnames";
import storage from "../storage";

class GoogleMapsLink extends React.Component {

    static sampleProps = {
        default: {
            children: (
                <div>Link text</div>
            ),
            to: new Location(fixtures.ixa.location),
        },
    };

    googleMapsUrl(): string {
        const toAddr = this.props.to;
        const {travelTime} = toAddr;
        const mode = travelTime && travelTime.mode == "TRANSIT" ? "r" : "w";
        const coords = storage.getJSON("coordinates");
        const start = encodeURIComponent(
            coords ? "Current Location" : `${storage.getItem("location")}`
        );
        const query = encodeURIComponent([
            toAddr.flat_unit,
            toAddr.street_number,
            toAddr.street_name,
            toAddr.street_type,
            toAddr.street_suffix,
            toAddr.suburb,
            toAddr.state,
            toAddr.postcode,
        ]
            .join(" ")
            .trim()
        );

        return `https://maps.google.com/?dirflg=${mode
        }&saddr=${start
        }&daddr=${query}`;
    }

    render(): ReactElement {
        const {
            className,
            children,
            ...rest,
        } = this.props;

        if (this.props.to.isConfidential()) {
            return (
                <span
                    className={classnames("GoogleMapsLink", className)}
                    {...rest}
                >
                    {children}
                </span>
            );
        }

        return (
            <a
                className={classnames("GoogleMapsLink", className)}
                target="_blank"
                aria-label="Open Google Maps in a new tab"
                href={this.googleMapsUrl()}
                {...rest}
            >
                    {children}
            </a>
        );
    }

}

export default GoogleMapsLink;
