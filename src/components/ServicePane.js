/* @flow */

"use strict";

import React from "react";
import mui from "material-ui";
import _ from "underscore";

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

    constructor(props: Object) {
        super(props);
        this.state = {
            siblings: null,
        };
    }

    // flow:disable
    get description(): string {
        return this.props.service.description.split('.', 1)[0] + '.';
    }

    async getSiblingServices(): Promise<void> {
        var response = await this.props.service.getSiblingServices();
        this.setState({siblings: response.objects});
    }

    componentDidMount(): void {
        this.getSiblingServices();
    }

    render(): React.Element {
        var object = this.props.service;
        var phones = _.filter(object.phones, (p) => p.kind != 'fax');
        var phoneOrder = ['freecall', 'phone', 'mobile'];
        phones = _(phones).sortBy((p) => phoneOrder.indexOf(p.kind));

        return (
            <div className="ServicePane">
                <main>
                    <h2 className="name">{object.name}</h2>
                    <h3 className="description">
                        {this.description}
                    </h3>

                    <hr />

                    <OpeningTimes object={object} />
                    <hr />
                    <Address {...object.location} />
                    <hr />
                    <CollapsedPhones phones={phones} />
                </main>

                <Eligibility
                    catchment={object.catchment}
                    eligibility_info={object.eligibility_info}
                    ineligibility_info={object.ineligibility_info}
                />

                <h2>What you can get here</h2>
                <ul>
                    {object.serviceProvisions.map(
                        (provision, index) => <li key={index}>{provision}</li>
                    )}
                </ul>

                <h2>Other services at this location</h2>
                {this.state.siblings ?
                    <ul>
                        {this.state.siblings.map((service, index) =>
                            <li key={index}>{service.name}</li>
                        )}
                    </ul>
                :
                    'Loading...'
                }
            </div>
        );
    }

}
