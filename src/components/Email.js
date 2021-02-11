/* @flow */
import React from "react";

import icons from "../icons";
import Link from "./Link";
import fixtures from "../../fixtures/services";
import sendEvent from "../google-tag-manager";

type Props = {
    email: string,
    comment: string,
}

export default class Email extends React.Component<Props, void> {
    static sampleProps = {default: fixtures.ixa.emails[0]};

    recordClick(): void {
        sendEvent({
            event: "clickEmail",
            address: this.props.email,
        })
    }

    render() {
        const { email } = this.props;

        return (
            <div className="Contact Email">
                <Link
                    to={`mailto:${email}`}
                    onClick={this.recordClick.bind(this)}
                    hideExternalLinkIcon={true}
                >
                    <icons.Email />
                    <div className="Contact-text">
                        <span className="kind">
                            {this.props.comment}
                        </span>
                        {this.props.comment && " "}
                        <span className="email value">{email}</span>
                        <icons.ExternalLink
                            containerClassName="ExternalLinkIcon"
                        />
                    </div>
                </Link>
            </div>
        );
    }
}
