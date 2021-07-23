/* @flow */
import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";

import Link from "./Link";
import fixtures from "../../fixtures/services";
import Location from "../iss/Location";
import classnames from "classnames";
import Spacer from "./Spacer";

type Props = {
    to: Location,
    children?: any,
    className: ?string,
    onClick?: ?function,
    hideSpacer?: ?boolean,
}

class GoogleMapsLink extends React.Component<Props, void> {
    static sampleProps: any = {
        default: {
            children: (
                <div>Link text</div>
            ),
            to: new Location(fixtures.ixa.location),
        },
    };

    static defaultProps: any = {
        hideSpacer: false,
    }

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

    render(): ReactElement<"span"> | ReactNode {
        const {
            className,
            children,
        } = this.props;

        if (this.props.to.isConfidential()) {
            return (
                <span
                    className={classnames("GoogleMapsLink", className)}
                >
                    <Spacer />
                    {children}
                </span>
            );
        }

        return (
            <Link
                className={classnames("GoogleMapsLink", className)}
                target="_blank"
                onClick={this.props.onClick}
                aria-label="Open Google Maps in a new tab"
                to={this.googleMapsUrl()}
            >
                {!this.props.hideSpacer && <Spacer />}
                {children}
            </Link>
        );
    }
}

export default GoogleMapsLink;
