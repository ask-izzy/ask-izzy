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
        var {
            className,
            children,
            ...rest,
        } = this.props;

        if (className) {
            className = `GoogleMapsLink ${className}`;
        } else {
            className = "GoogleMapsLink";
        }

        if (this.props.to.isConfidential()) {
            return (
                <span
                    className={className}
                    {...rest}
                >
                    {children}
                </span>
            );
        }

        return (
            <a
                className={className}
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
