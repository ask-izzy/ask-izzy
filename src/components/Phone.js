/* @flow */
import React from "react";
import { titleize } from "underscore.string";

import * as gtm from "../google-tag-manager";
import type {AnalyticsEvent} from "../google-tag-manager";
import icons from "../icons";

type Props = phone & {
    crisis?: boolean,
    analyticsEventDetails?: AnalyticsEvent
}

class Phone extends React.Component<Props, void> {
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
        let contactButtonClassName = "ContactButton";
        let phonebutton = <icons.Phone />;

        if (this.props.crisis) {
            // Customise crisis services with style branding
            contactButtonClassName += " CrisisContactButton"
            phonebutton = <icons.PhoneSolid />;
        }

        return (
            <div className="Contact Phone">
                <span className="kind">
                    {this.displayComment}
                </span>
                <a
                    href={this.href}
                    className={contactButtonClassName}
                    onClick={this.recordClick}
                >
                    <div
                        className="Contact-text"
                    >
                        {phonebutton}
                        <span className="number value">
                            {this.props.number}
                        </span>
                    </div>
                </a>
            </div>
        );
    }
}

export default Phone;
