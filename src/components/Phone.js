/* @flow */
import React from "react";
import { titleize } from "underscore.string";

import sendEvent from "../google-tag-manager";
import PhoneIcon from "../icons/phone.svg";
import PhoneSolid from "../icons/phone-solid.svg";

type Props = phone & {
    crisis?: boolean
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

    recordClick(): void {
        sendEvent({
            event: "clickPhoneNumber",
            number: this.props.number,
            crisis: this.props.crisis,
        });
    }

    render() {
        let contactButtonClassName = "ContactButton";
        let phonebutton = <PhoneIcon />;

        if (this.props.crisis) {
            // Customise crisis services with style branding
            contactButtonClassName += " CrisisContactButton"
            phonebutton = <PhoneSolid />;
        }

        return (
            <div className="Contact Phone">
                <span className="kind">
                    {this.props.comment ? this.props.comment
                        : titleize(this.props.kind)}
                </span>
                <a
                    href={this.href}
                    className={contactButtonClassName}
                    onClick={this.recordClick.bind(this)}
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
