/* @flow */
import React from "react";
import { titleize } from "underscore.string";

import Icons from "../icons";
import fixtures from "../../fixtures/services";

class Phone extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {default: fixtures.ixa.phones[0]};

    // flow:disable not supported yet
    get href(): string {
        return "tel:" + this.props.number.replace(/[^0-9\+]/g, "");
    }

    render(): ReactElement {
        return (
            <div className="Contact Phone">
                <a href={this.href}>
                    <Icons.Phone />
                    <div className="Contact-text">
                        <span className="kind">
                            {this.props.comment ? this.props.comment
                            : titleize(this.props.kind)}
                        </span>
                        {' '}
                        <span className="number value">{this.props.number}</span>
                    </div>
                </a>
            </div>
        );
    }

}

export default Phone;
