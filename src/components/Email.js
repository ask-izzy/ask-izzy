/* @flow */
import React from "react";

import fixtures from "../../fixtures/services";

export default class Email extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {default: fixtures.ixa.emails[0]};

    render(): ReactElement {
        let {
            email,
        } = this.props;

        return (
            <div className="Contact Email">
                <a href={`mailto:${email}`}>
                    <div className="Contact-text">
                        <span className="kind">
                            {this.props.comment ? this.props.comment
                            : "Email"}
                        </span>
                        {' '}
                        <span className="email value">{email}</span>
                    </div>
                </a>
            </div>
        );
    }
}
