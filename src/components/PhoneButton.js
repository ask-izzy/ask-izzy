/* @flow */
import React from "react";
import { titleize } from "underscore.string";

import * as gtm from "../google-tag-manager";
import type {AnalyticsEvent} from "../google-tag-manager";
import {toCamelCase} from "../utils"

type Props = phone & {
    crisis?: boolean,
    analyticsEventDetails?: AnalyticsEvent,
    styleType?: string // currently only "hollow" is supported
}

export default class PhoneButton extends React.Component<Props, void> {
    static sampleProps = {default: {
        "comment": "Here is a phone number with a long comment" +
            ", like, a really long comment",
        "kind": "phone",
        "number": "(03) 3333 3333",
    }};

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
            event: "clickPhoneNumber",
            number: this.props.number,
            crisis: this.props.crisis,
        });

        const event = Object.assign({}, {
            event: "Phone Number Clicked",
            eventCat: "Phone Number Clicked",
            eventAction: "",
            eventLabel: `${location.pathname} - ${this.props.number}` +
                `${this.props.crisis ? " (Crisis Number)" : ""}`,
            sendDirectlyToGA: true,
        }, this.props.analyticsEventDetails)

        gtm.emit(event, "GTM-54BTPQM");
    }
    recordClick = this.recordClick.bind(this)

    render() {
        let className = "Contact Phone" + (
            this.props.styleType ?
                ` ${toCamelCase("style " + this.props.styleType)}`
                : ""
        )

        return (
            <div className={className}>
                <span className="kind">
                    {this.displayComment}
                </span>
                <a
                    href={this.href}
                    className="ContactButton"
                    onClick={this.recordClick}
                >
                    <div
                        className="Contact-text"
                    >
                        <span className="number value">
                            {this.props.number}
                        </span>
                    </div>
                </a>
            </div>
        );
    }
}
