/* @flow */
import React from "react";
import Icons from "../icons";
import fixtures from "../../fixtures/services";

class Phone extends React.Component {

    // flow:disable not supported yet
    static sampleProps = fixtures.ixa.phones[0];

    number(): string {
        if (this.props) {
            return this.props.number;
        }

        return "";
    }

    href(): string {
        return "tel:" + this.number().replace(/[^0-9\+]/g, '');
    }

    render(): React.Element {
        return (
            <a className="Phone" href={this.href()}>
                <Icons.Phone />
                { this.number() }
            </a>
        );
    }

}

export default Phone;
