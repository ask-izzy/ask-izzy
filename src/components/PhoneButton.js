/* @flow */
import type {Element as ReactElement, Node as ReactNode} from "React";
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
    analyticsEventDetails?: AnalyticsEvent,
    className?: ?string,
    hasDetails?: ReactNode,
    styleType?: string // currently only "hollow" is supported
}

export default class PhoneButton extends React.Component<Props, void> {
    static defaultProps: any = {
        hasDetails: <></>,
    }

    get href(): string {
        return "tel:" + this.props.number.replace(/[^0-9+]/g, "");
    }

    get displayComment(): string {
        return this.props.comment ?
            this.props.comment
            : titleize(this.props.kind)
    }

    recordClick(): void {
        gtm.emit({
            event: "Phone Number Clicked",
            eventCat: "Phone Number Clicked",
            eventAction: "",
            eventLabel: `${location.pathname} - ${this.props.number}` +
                `${this.props.crisis ? " (Crisis Number)" : ""}`,
            sendDirectlyToGA: true,
            ...this.props.analyticsEventDetails,
        });
    }
    recordClick: any = this.recordClick.bind(this)

    render(): ReactElement<"div"> {
        const className = classnames(
            "Contact",
            "Phone",
            this.props.styleType ?
                ` ${toCamelCase("style " + this.props.styleType)}`
                : ""
        )
        const icon = this.props.styleType === "hollow" ?
            <icons.Phone />
            : <icons.PhoneSolid />

        return (
            <div className={className}>
                <ScreenReader>
                    Phone contact:
                </ScreenReader>
                <Link
                    to={this.href}
                    className="ContactButton"
                    onClick={this.recordClick}
                    analyticsEvent={{
                        event: "Link Followed - Phone Contact",
                        eventAction: `Contact detail - phone` +
                            `${this.props.crisis ? " - crisis line" : ""}`,
                        eventLabel: `${this.props.number}`,
                    }}
                >
                    <div className="Contact-text">
                        {icon}
                        <span>Call </span>
                        <span className="number value">
                            {this.props.number}
                        </span>
                    </div>
                </Link>
                <div className="detailsContainer">
                    <UrlsToLinks>{this.displayComment}</UrlsToLinks>
                    {this.props.hasDetails}
                </div>

            </div>
        );
    }
}
