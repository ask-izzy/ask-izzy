/* @flow */
import React from "react";
import { titleize } from "underscore.string";

import icons from "../icons";

class Phone extends React.Component {

    static sampleProps = {default: {
        "comment": "Here is a phone number with a long comment" +
            ", like, a really long comment",
        "kind": "phone",
        "number": "(03) 3333 3333",
    }};

    // flow:disable not supported yet
    get href(): string {
        return "tel:" + this.props.number.replace(/[^0-9\+]/g, "");
    }

    render(): ReactElement {
        return (
            <div className="Contact Phone">
                <span className="kind">
                    {this.props.comment ? this.props.comment
                    : titleize(this.props.kind)}
                </span>
                <a href={this.href}
                    className="ContactButton"
                >
                    <div
                        className="Contact-text"
                    >
                        <icons.Phone />
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
