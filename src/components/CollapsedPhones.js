/* @flow */

"use strict";

import React from "react";
import mui from "material-ui";

import Collapser from "./Collapser";
import Icons from "../icons";
import Phone from "./Phone";
import ScreenReader from "./ScreenReader";
import fixtures from "../../fixtures/services";

class CollapsedPhones extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {
        default: {phones: fixtures.ixa.phones, expanded: false},
        open: {phones: fixtures.ixa.phones, expanded: true},
        "two numbers": {phones: [
            {kind: "phone", number: "(03) 3333 3333"},
            {kind: "phone", number: "(03) 5555 5555"},
        ],},
    };

    render(): React.Element {
        var phones = this.props.phones;

        if (phones && phones.length) {
            var first = phones.shift();
            var extras = null;
            if (phones.length > 1) {
                extras = (
                    <Collapser
                        message="Other contact options"
                        expanded={this.props.expanded}
                    >
                        {
                            phones.map((phone, idx) =>
                                <Phone {...phone} key={idx} />
                            )
                        }
                    </Collapser>
                );
            } else if (phones.length == 1) {
                extras = <Phone {...phones[0] } key="second" />;
            }

            return (
                <div className="CollapsedPhones">

                    <ScreenReader>
                        <h4>Phone numbers</h4>
                    </ScreenReader>
                    <Phone {...first} key="first" />
                    {extras}
                </div>
            );

        } else {
            // No phones
            return null;
        }

    }

}

export default CollapsedPhones;
