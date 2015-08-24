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
            <div>
                <mui.Paper>
                    <p>
                        {object.name}
                    </p>
                    <p>
                        {object.description}
                    </p>
                </mui.Paper>
                <mui.Paper>
                    <OpeningTimes object={object} />
                </mui.Paper>
                <mui.Paper>
                    <Address {...object.location} />
                </mui.Paper>

                <CollapsedPhones phones={object.phones} />

                <mui.Paper>
                    <Eligibility
                        catchment={object.catchment}
                        eligibility_info={object.eligibility_info}
                        ineligibility_info={object.ineligibility_info}
                    />
                </mui.Paper>
            </div>
        );
    }

}
