/* @flow */
import type { Node as ReactNode } from "React";
import React from "react";
import { titleize } from "underscore.string";

import Link from "./base/Link";
import type { AnalyticsEvent } from "../google-tag-manager";
import icons from "../icons";
import classnames from "classnames";
import type { phone } from "../iss/general";
import ScreenReader from "./ScreenReader";
import FormatText from "./FormatText";
import { PhoneHref } from "@/helpers/regex.helpers";

type Props = phone & {
    crisis?: boolean,
    number?: string,
    kind?: string,
    comment?: string,
    analyticsEventDetails?: AnalyticsEvent,
    className?: ?string,
    hasDetails?: ReactNode,
    styleType?: string, // currently only "hollow" or "link" is supported
};

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
        <icons.Phone /> :
        <icons.PhoneSolid />;

    function displayComment(): string {
        return comment ? comment : titleize(kind);
    }

    return (
        <div className={
            classnames(
                "Contact",
                "Phone",
                "link-style" // adding a specific class for the link style
            )
        }>

            <ScreenReader>
                Phone contact:
            </ScreenReader>
            <Link
                to={PhoneHref(number)}
                className={styleType === "link" ? "ContactLink" : "ContactButton"}
                analyticsEvent={{
                    event: "Link Followed - Phone Contact",
                    eventAction: `Contact detail - phone${crisis ? " - crisis line" : ""}`,
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
                    {styleType === "link" && <span>{" (" + displayComment() + ")"}</span>}
                </div>
            </Link>
            {styleType !== "link" && (
                <div className="details-container">
                    <FormatText>{displayComment()}</FormatText>
                    {hasDetails && (
                        <div className="crisis-line-details">
                            {hasDetails}
                            Call Info
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PhoneButton;
