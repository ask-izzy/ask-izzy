import React, {ReactNode} from "react";
import {titleize} from "underscore.string";

import Link from "@/src/components/base/Link";
import type {AnalyticsEvent} from "@/src/google-tag-manager";
import Phone from "@/src/icons/Phone";
import PhoneSolid from "@/src/icons/PhoneSolid";
import classnames from "classnames"
import type { phone } from "@/src/iss/general";
import {toCamelCase} from "@/src/utils/strings";
import ScreenReader from "@/src/components/ScreenReader";
import UrlsToLinks from "@/src/components/UrlsToLink"

type Props = phone & {
    crisis?: boolean,
    number?: string,
    kind?: string,
    comment?: string,
    analyticsEventDetails?: AnalyticsEvent,
    hasDetails?: ReactNode,
    styleType?: string // currently only "hollow" is supported
}

function PhoneButton({
    crisis,
    number,
    kind,
    comment,
    analyticsEventDetails,
    hasDetails = <></>,
    styleType,
}: Props): ReactNode {
    const icon = styleType === "hollow" ?
        <Phone />
        : <PhoneSolid />

    function href(): string {
        return "tel:" + number.replace(/[^0-9+]/g, "")
    }

    function displayComment(): string {
        return comment ? comment : titleize(kind)
    }

    return (
        <div className={
            classnames(
                "Contact",
                "Phone",
                styleType ?
                    ` ${toCamelCase("style " + styleType)}`
                    : "",
            )
        }
        >
            <ScreenReader>
                    Phone contact:
            </ScreenReader>
            <Link
                to={href()}
                className="ContactButton"
                analyticsEvent={{
                    event: "Link Followed - Phone Contact",
                    eventAction: `Contact detail - phone` +
                            `${crisis ? " - crisis line" : ""}`,
                    eventLabel: `${number}`,
                    ...analyticsEventDetails,
                }}
            >
                <div className="Contact-text">
                    {icon}
                    <span>Call </span>
                    <span className="number value">
                        {number}
                    </span>
                </div>
            </Link>
            <div className="details-container">
                <UrlsToLinks>{displayComment()}</UrlsToLinks>
                {
                    hasDetails &&
                    <div className="crisis-line-details">
                        {hasDetails}
                        Call Info
                    </div>
                }
            </div>

        </div>
    )
}

export default PhoneButton