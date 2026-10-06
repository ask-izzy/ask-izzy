import type {ReactNode} from "react"
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
    className: string | null | undefined,
    onClick?: (event: React.SyntheticEvent<HTMLAnchorElement>) => void,
    hideSpacer?: boolean | null | undefined,
    hideConfidential?: boolean | null | undefined,
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
            // @ts-expect-error TODO(ts-migration): Type '{ children: any[]; className: any; target: string; onClick: (…
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
