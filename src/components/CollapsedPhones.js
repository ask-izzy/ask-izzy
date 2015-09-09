/* @flow */
import React from "react";
import Collapser from "./Collapser";
import Phone from "./Phone";
import Icons from "../icons";
import mui from "material-ui";
import fixtures from "../../fixtures/services";
import ScreenReader from "./ScreenReader";

class CollapsedPhones extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {
        default: {phones: fixtures.ixa.phones},
        open: {phones: fixtures.ixa.phones, expanded: true}
    };

    render(): React.Element {
        var phones = this.props.phones;

        if (phones && phones.length) {
            var first = phones.shift();
            var extras = null;
            if (phones.length) {
                extras = (
                    <Collapser
                        message="Other contact options"
                    >
                        {
                            phones.map((phone, idx) =>
                                <Phone {...phone} key={idx} />
                            )
                        }
                    </Collapser>
                );
            }

            return (
                <div className="CollapsedPhones">

                    <ScreenReader>
                        <h4>Phone numbers</h4>
                    </ScreenReader>
                    <Phone {...first} />
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
