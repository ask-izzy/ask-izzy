/* @flow */

"use strict";

import React from "react";
import mui from "material-ui";

import Address from "../components/Address";
import CollapsedPhones from "../components/CollapsedPhones";
import Eligibility from "../components/Eligibility";
import OpeningTimes from "../components/OpeningTimes";
import colors from "../constants/theme";
import fixtures from "../../fixtures/services";

var palette = colors.getPalette();

export default class ServicePane extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {service: fixtures.youthSupportNet};

    render(): React.Element {
        var object = this.props.service;
        return (
            <div className="ServicePane">
                <main>
                    <h2 className="name">{object.name}</h2>
                    <h3 className="description">
                        {object.description.split('.')[0] + '.'}
                    </h3>

                    <hr />

                    <OpeningTimes object={object} />
                    <hr />
                    <Address {...object.location} />
                    <hr />
                    <CollapsedPhones phones={object.phones} />
                </main>

                <Eligibility
                    catchment={object.catchment}
                    eligibility_info={object.eligibility_info}
                    ineligibility_info={object.ineligibility_info}
                />
            </div>
        );
    }

}
