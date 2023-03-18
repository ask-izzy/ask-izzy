/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import { titleize } from "underscore.string";

import Link from "./base/Link";
import * as gtm from "../google-tag-manager";
import type {AnalyticsEvent} from "../google-tag-manager";
import icons from "../icons";
import classnames from "classnames"
import type { phone } from "../iss/general";
import {toCamelCase} from "../utils/strings";
import ScreenReader from "./ScreenReader";
import UrlsToLinks from "./UrlsToLink"

type Props = phone & {
    crisis?: boolean,
    number?: string,
    kind?: string,
    comment?: string,
    analyticsEventDetails?: AnalyticsEvent,
    className?: ?string,
    hasDetails?: ReactNode,
    styleType?: string // currently only "hollow" is supported
}

function PhoneButton({
    crisis,
    number,
    kind,
    comment,
    analyticsEventDetails,
    className,
    hasDetails,
    styleType,
}: Props): ReactNode {
    const icon = styleType === "hollow" ?
        <icons.Phone />
        : <icons.PhoneSolid />

    function href(): string {
        return "tel:" + number.replace(/[^0-9+]/g, "")
    }

    function displayComment(): string {
        return comment ? comment : titleize(kind)
    }

    function recordClick(): void {
        gtm.emit({
            event: "Phone Number Clicked",
            eventCat: "Phone Number Clicked",
            eventAction: "",
            eventLabel: `${location.pathname} - ${number}` +
                `${crisis ? " (Crisis Number)" : ""}`,
            sendDirectlyToGA: true,
            ...analyticsEventDetails,
        });
    }



    return (
        <div className={
            classnames(
                "Contact",
                "Phone",
                styleType ?
                    ` ${toCamelCase("style " + styleType)}`
                    : ""
            )
        }
        >
            <ScreenReader>
                    Phone contact:
            </ScreenReader>
            <Link
                to={href()}
                className="ContactButton"
                onClick={recordClick}
                analyticsEvent={{
                    event: "Link Followed - Phone Contact",
                    eventAction: `Contact detail - phone` +
                            `${crisis ? " - crisis line" : ""}`,
                    eventLabel: `${number}`,
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