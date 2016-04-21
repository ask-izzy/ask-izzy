/* @flow */
import React from "react";

import icons from "../icons";
import fixtures from "../../fixtures/services";
import sendEvent from "../google-tag-manager";

export default class Email extends React.Component {

    static sampleProps = {default: fixtures.ixa.emails[0]};

    recordClick(): void {
        sendEvent({
            event: "clickEmail",
            address: this.props.email,
        })
    }

    render() {
        let {
            email,
        } = this.props;

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
