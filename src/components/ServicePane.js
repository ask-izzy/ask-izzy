import React from "react";
import Router from "react-router";
import mui from "material-ui";
import fixtures from "../../fixtures/services";
import OpeningTimes from "../components/OpeningTimes";
import Address from "../components/Address";
import Eligibility from "../components/Eligibility";
import CollapsedPhones from "../components/CollapsedPhones";

import colors from "../constants/theme";
var palette = colors.getPalette();

export default class ServicePane extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {service: fixtures.youthSupportNet};

    render(): React.Element {
        var object = this.props.service;
        return (
            <div>

                <mui.AppBar title={object.site.name} />
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
