/* @flow */
import React from "react";
import Collapser from "./Collapser";
import Phone from "./Phone";
import Icons from "../icons";
import mui from "material-ui";
import fixtures from "../../fixtures/services";

class CollapsedPhones extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {phones: fixtures.ixa.phones};

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
                <mui.Paper>
                    <Phone {...first} />
                    {extras}
                </mui.Paper>
            );

        } else {
            // No phones
            return null;
        }

    }

}

export default CollapsedPhones;
