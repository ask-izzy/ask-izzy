/* @flow */
import React from "react";
import { titleize } from "underscore.string";

import Icons from "../icons";
import fixtures from "../../fixtures/services";

export default class Email extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {default: fixtures.ixa.emails[0]};

    render(): React.Element {
        var {
            email,
            comment,
        } = this.props;

        return (
            <div className="Contact Email">
                <a href={`mailto:${email}`}>
                    <span className="kind">
                        { this.props.comment ?
                            this.props.comment
                        :
                            "Email"
                        }
                    </span>
                    {' '}
                    <span className="email">{email}</span>
                </a>
            </div>
        );
    }
}
