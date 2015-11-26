/* @flow */
import React from "react";

import icons from "../icons";
import fixtures from "../../fixtures/services";

export default class Email extends React.Component {

    static sampleProps = {default: fixtures.ixa.emails[0]};

    render(): ReactElement {
        let {
            email,
        } = this.props;

        return (
            <div className="Contact Email">
                <a href={`mailto:${email}`}>
                    <icons.Email />
                    <div className="Contact-text">
                        <span className="kind">
                            {this.props.comment ? this.props.comment
                            : ""}
                        </span>
                        {" "}
                        <span className="email value">{email}</span>
                    </div>
                </a>
            </div>
        );
    }
}
