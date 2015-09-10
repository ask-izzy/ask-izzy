/* @flow */

"use strict";

import React from "react";
import Router from "react-router";
import mui from "material-ui";
import _ from "underscore";

import Address from "../components/Address";
import CollapsedPhones from "../components/CollapsedPhones";
import Eligibility from "../components/Eligibility";
import OpeningTimes from "../components/OpeningTimes";
import colors from "../constants/theme";
import fixtures from "../../fixtures/services";
import icons from "../icons";

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
                        {object.shortDescription}
                    </h3>

                    <hr />

                    <OpeningTimes object={object} />
                    <hr />
                    <Address {...object.location} />
                    <hr />
                    <CollapsedPhones phones={phones} />
                </main>

                <Eligibility
                    className="padded"
                    catchment={object.catchment}
                    eligibility_info={object.eligibility_info}
                    ineligibility_info={object.ineligibility_info}
                />

                <div className="padded">
                    <h3>What you can get here</h3>
                    <ul>
                        {object.serviceProvisions.map((provision, index) =>
                            <li key={index}>{provision}</li>
                        )}
                    </ul>
                </div>

                {this.renderSiblings()}
            </div>
        );
    }

    renderSiblings(): React.Element {
        if (!this.state.siblings) {
            return '';
        }

        return (
            <div>
                <h3 className="padded">
                    Other services at this location
                </h3>
                <mui.List className="List">
                    {this.state.siblings.map((service, index) =>
                        <mui.ListItem className="ListItem"
                            key={index}
                            primaryText={service.name}
                            secondaryText={service.shortDescription}
                            containerElement={
                                <Router.Link
                                    to="service"
                                    params={{id: service.slug}}
                                />
                            }

                            rightIcon={
                                <icons.Chevron />
                            }

                            disableFocusRipple={true}
                            disableTouchRipple={true}
                        />
                    )}
                </mui.List>
            </div>
        );
    }
}
