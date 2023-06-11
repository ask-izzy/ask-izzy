/* @flow */
import type {Node as ReactNode} from "React"
import React from "react"

import Link from "./base/Link"
import AddressLocation from "../iss/AddressLocation"
import type {travelTime} from "../iss/general"
import classnames from "classnames"
import Spacer from "./Spacer"

type Props = {
    to: AddressLocation,
    travelTimes?: Array<travelTime>,
    children?: any,
    className: ?string,
    onClick?: (event: SyntheticEvent<HTMLAnchorElement>) => void,
    hideSpacer?: ?boolean,
    hideConfidential?: ?boolean,
}

function GoogleMapsLink({
    to,
    travelTimes = [],
    children,
    className,
    onClick,
    hideSpacer = false,
    hideConfidential = false,
}: Props): ReactNode {

    function googleMapsUrl(): string {
        const toAddr = to
        const mode = travelTimes?.some(
            travelTime => travelTime.mode === "TRANSIT"
        ) ? "r" : "w"
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
        )

        return `https://maps.google.com/?dirflg=${mode
        }&daddr=${query}`
    }

    if (to.isConfidential()) {
        return (
            hideConfidential ? <></>
                : <span className={classnames("GoogleMapsLink", className)}>
                    <Spacer />
                    {children}
                </span>
        )
    }

    return (
        <Link
            className={classnames("GoogleMapsLink", className)}
            target="_blank"
            onClick={onClick}
            aria-label="Open Google Maps in a new tab"
            to={googleMapsUrl()}
            analyticsEvent={{
                event: `Link Followed - Google Maps`,
                eventAction: "Google maps",
                eventLabel: null,
            }}
        >
            {!hideSpacer && <Spacer />}
            {children}
        </Link>
    )
}

export default GoogleMapsLink
