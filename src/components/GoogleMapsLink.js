/* @flow */
import React from "react";
import fixtures from "../../fixtures/services";
import Location from "../iss/Location";

class GoogleMapsLink extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {
        default: {
            children: (
                <div>Link text</div>
            ),
            to: new Location(fixtures.ixa.location),
        },
    };

    googleMapsUrl(): string {
        var toAddr = this.props.to;
        var start = "Current+Location";
        var query = encodeURIComponent(
            `${toAddr.streetAddressLine1()} ${toAddr.streetAddressLine2()}`
        );

        return `https://maps.google.com/?saddr=${start}&addr=${query}`;
    }

    render(): ReactElement {
        if (this.props.to.isConfidential()) {
            return (
                <span {...this.props} >
                    {this.props.children}
                </span>
            );
        }

        return (
            <a
                target="_blank"
                aria-label="Open Google Maps in a new tab"
                href={this.googleMapsUrl()}
                {...this.props}
            >
                    {this.props.children}
            </a>
        );
    }

}

export default GoogleMapsLink;
