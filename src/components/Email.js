/* @flow */
import React from "react";

import icons from "../icons";
import fixtures from "../../fixtures/services";
import * as gtm from "../google-tag-manager";
import type {AnalyticsEvent} from "../google-tag-manager";

type Props = {
    email: string,
    comment: string,
    analyticsEventDetails?: AnalyticsEvent
}

export default class Email extends React.Component<Props, void> {
    static sampleProps = {default: fixtures.ixa.emails[0]};

    recordClick(): void {
        gtm.emit({
            event: "clickEmail",
            address: this.props.email,
        })

        const event = Object.assign({}, {
            event: "Email Clicked",
            eventCat: "Email Clicked",
            eventAction: "",
            eventLabel: `${location.pathname} - ${this.props.email}`,
            sendDirectlyToGA: true,
        }, this.props.analyticsEventDetails)

        gtm.emit(event, "GTM-54BTPQM")
    }

    render() {
        const { email } = this.props;

        return (
            <div className="Contact Email">
                <a
                    href={`mailto:${email}`}
                    onClick={this.recordClick.bind(this)}
                >
                    <icons.Email />
                    <div className="Contact-text">
                        <span className="kind">
                            {this.props.comment}
                        </span>
                        {this.props.comment && " "}
                        <span className="email value">{email}</span>
                    </div>
                </a>
            </div>
        );
    }
}
