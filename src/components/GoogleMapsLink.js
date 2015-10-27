/* @flow */
import React from "react";
import fixtures from "../../fixtures/services";
import Location from "../iss/Location";

class GoogleMapsLink extends React.Component {

    static defaultProps = {
        from: "", // Empty string makes the maps app use your current location
    };

    static sampleProps = {
        default: {
            children: (
                <div>Link text</div>
            ),
            to: new Location(fixtures.ixa.location),
        },
    };

    googleMapsUrl(): string {
        let toAddr = this.props.to;

        let start = encodeURIComponent(this.props.from);
        let query = encodeURIComponent(
            `${toAddr.streetAddressLine1()} ${toAddr.streetAddressLine2()}`
        );

        // FIXME: Choose directionsmode based on expected travel time.
        return `https://maps.google.com/?dirflg=w&saddr=${start}&daddr=${query}`;
    }

    render(): ReactElement {
        let {
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
