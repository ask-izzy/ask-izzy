/* @flow */
import type {Element as ReactElement} from "React";
import React from "react";

import icons from "../icons";
import Link from "./Link";
import fixtures from "../../fixtures/services";
import * as gtm from "../google-tag-manager";
import type {AnalyticsEvent} from "../google-tag-manager";

type Props = {
    email: string,
    comment: string,
    analyticsEventDetails?: AnalyticsEvent
}

export default class Email extends React.Component<Props, void> {
    static sampleProps: any = {default: fixtures.ixa.emails[0]};

    recordClick(): void {
        gtm.emit({
            event: "Email Clicked",
            eventCat: "Email Clicked",
            eventAction: "",
            eventLabel: `${location.pathname} - ${this.props.email}`,
            sendDirectlyToGA: true,
            ...this.props.analyticsEventDetails,
        })
    }

    render(): ReactElement<"div"> {
        const { email } = this.props;

        return (
            <div className="Contact Email">
                <Link
                    to={`mailto:${email}`}
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
                </Link>
            </div>
        );
    }
}
