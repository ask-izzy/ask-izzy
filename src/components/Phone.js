/* @flow */
import React from "react";
import Icons from "../icons";
import fixtures from "../../fixtures/services";
import { titleize } from "underscore.string";

class Phone extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {default: fixtures.ixa.phones[0]};

    // flow:disable not supported yet
    get href(): string {
        return "tel:" + this.props.number.replace(/[^0-9\+]/g, '');
    }

    render(): React.Element {
        return (
            <a className="Phone" href={this.href}>
                <Icons.Phone />
                <span className="kind">{ titleize(this.props.kind) } </span>
                { this.props.number }
            </a>
        );
    }

}

export default Phone;
