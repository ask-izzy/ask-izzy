/* @flow */
import type {Element as ReactElement} from "React";
import React from "react";

import Link from "./base/Link";
import Location from "../iss/Location";
import classnames from "classnames";
import ExternalLinkIcon from "../icons/ExternalLink";

type Props = {
    to: Location,
    className?: string,
    onClick?: ?function,
}

class GoogleMapsLink extends React.Component<Props, void> {
    googleMapsUrl(): string {
        const toAddr = this.props.to;
        const travelTimes = toAddr?.travelTime || [];
        const mode = travelTimes.some(
            travelTime => travelTime.mode === "TRANSIT"
        ) ? "r" : "w";
        let queryFields = [
            toAddr.flat_unit,
            toAddr.street_number,
            toAddr.street_name,
            toAddr.street_type,
            toAddr.street_suffix,
            toAddr.suburb,
            toAddr.state,
            toAddr.postcode,
        ]

        if (toAddr.isSuburbOnly()) {
            queryFields = [
                toAddr.suburb,
                toAddr.state,
                toAddr.postcode,
            ]
        }
        const query = encodeURIComponent(
            queryFields
                .join(" ")
                .trim()
        );

        return `https://maps.google.com/?dirflg=${mode
        }&daddr=${query}`;
    }

    render(): ReactElement<typeof Link> | null {
        const {
            className,
        } = this.props;

        if (this.props.to.isConfidential()) {
            return null
        }

        return (
            <Link
                className={classnames("GoogleMapsLink", className)}
                target="_blank"
                onClick={this.props.onClick}
                aria-label="Open Google Maps in a new tab"
                to={this.googleMapsUrl()}
                analyticsEvent={{
                    event: `Link Followed - Google Maps`,
                    eventAction: "Google maps",
                    eventLabel: null,
                }}
            >
                Get directions in Google Maps
                <ExternalLinkIcon />
            </Link>
        );
    }
}

export default GoogleMapsLink;
