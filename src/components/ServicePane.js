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
import fixtures from "../../fixtures/services";
import icons from "../icons";
import iss from "../iss";

export default class ServicePane extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {default: {
        service: Object.assign(
            new iss.Service,
            fixtures.youthSupportNet
        ),},
    };

    constructor(props: Object) {
        super(props);
        this.state = {
            siblings: null,
        };
    }

    // flow:disable not supported yet
    static propTypes = {
        service: React.PropTypes.instanceOf(iss.Service).isRequired,
    };

    async getSiblingServices(): Promise<void> {
        var response = await this.props.service.getSiblingServices();
        this.setState({siblings: response.objects});
    }

    componentDidMount(): void {
        this.getSiblingServices();
    }

    componentDidUpdate(prevProps: Object, prevState: Object): void {
        if (prevProps.service != this.props.service) {
            this.getSiblingServices();
        }
    }

    render(): React.Element {
        var object = this.props.service;
        var filteredPhoneKinds = new Set(['fax', 'tty']);
        var phoneOrder = ['freecall', 'phone', 'mobile'];
        var phones = _.filter(
            object.phones,
            (p) => !filteredPhoneKinds.has(p.kind)
        );
        phones = _(phones).sortBy((p) => phoneOrder.indexOf(p.kind));
        phones = _(phones).uniq((p) => p.number);

        return (
            <div className="ServicePane">
                <main>
                    <h2 className="name">{object.name}</h2>
                    <h3 className="description">
                        {object.shortDescription}
                    </h3>

                    <hr />

                    <OpeningTimes object={object.open} />
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
            <div className="siblings">
                <h3 className="padded">
                    Also at this location
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
                                    params={{slug: service.slug}}
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
