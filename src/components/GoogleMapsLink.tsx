import React from "react"
import classnames from "classnames"

import Link from "@/src/components/base/Link.js"
import AddressLocation from "@/src/iss/AddressLocation.js"
import type {travelTime} from "@/src/iss/general.js"
import Spacer from "@/src/components/Spacer.js"

type Props = {
    to: AddressLocation,
    travelTimes?: Array<travelTime>,
    children?: any,
    className: string | null | undefined,
    onClick?: (event: React.SyntheticEvent<HTMLAnchorElement>) => void,
    hideSpacer?: boolean | null,
}

function GoogleMapsLink({
    to,
    travelTimes = [],
    children,
    className,
    onClick,
    hideSpacer = false,
}: Props) {

    function googleMapsUrl(): string {
        const toAddr = to
        const mode = travelTimes?.some(
            travelTime => travelTime.mode === "TRANSIT",
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
                .trim(),
        )

        return `https://maps.google.com/?dirflg=${mode
        }&daddr=${query}`
    }

    if (to.isConfidential()) {
        return (
            <span
                className={classnames("GoogleMapsLink", className)}
            >
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
