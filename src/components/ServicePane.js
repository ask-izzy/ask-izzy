/* @flow */

import React from "react";
import { Link } from "react-router";
import mui from "material-ui";
import _ from "underscore";

import Address from "./Address";
import CollapsedOpeningTimes from "./CollapsedOpeningTimes";
import ContactMethods from "./ContactMethods";
import Eligibility from "./Eligibility";
import TransportTime from "./TransportTime";
import GoogleMapsLink from "./GoogleMapsLink";
import fixtures from "../../fixtures/services";
import ServiceFactory from "../../fixtures/factories/Service";
import icons from "../icons";

export default class ServicePane extends React.Component {

    constructor(props: Object) {
        super(props);
        this.state = {
            siblings: null,
        };
    }

    componentDidMount(): void {
        this.getSiblingServices();
    }

    componentDidUpdate(prevProps: Object, prevState: Object): void {
        if (prevProps.service != this.props.service) {
            this.getSiblingServices();
        }
    }

    // flow:disable not supported yet
    static sampleProps = {default: {
        service: ServiceFactory(fixtures.youthSupportNet),
    }};

    async getSiblingServices(): Promise<void> {
        var response = await this.props.service.getSiblingServices();

        this.setState({siblings: response.objects});
    }

    render(): ReactElement {
        var object = this.props.service;

        return (
            <div className="ServicePane">
                <main>
                    <h2 className="name">{object.name}</h2>
                    <h3 className="description">
                        {object.shortDescription}
                    </h3>

                    <hr />

                    <CollapsedOpeningTimes object={object.open} />
                    <hr />
                    <Address location={object.Location()} />
                    <hr />
                    <ContactMethods object={object} />
                    <hr />
                    <GoogleMapsLink
                        className="plain-text"
                        to={object.Location()}
                    >
                        <TransportTime location={object.Location()}/>
                    </GoogleMapsLink>
                </main>

                <Eligibility
                    catchment={object.catchment}
                    eligibility_info={object.eligibility_info}
                    ineligibility_info={object.ineligibility_info}
                />

                {this.renderServiceProvisions()}
                {this.renderSiblings()}
            </div>
        );
    }

    renderServiceProvisions(): ReactElement {
        var object = this.props.service;

        if (_.isEmpty(object.serviceProvisions)) {
            return <div />;
        }

        return (
            <div className="padded">
                <h3 className="serviceProvisions-header">
                    What you can get here
                </h3>
                <ul>
                    {object.serviceProvisions.map(
                        (provision, index) =>
                        <li key={index}>{provision}</li>
                    )}
                </ul>
            </div>
        );
    }

    renderSiblings(): ReactElement {
        if (_.isEmpty(this.state.siblings)) {
            return <span />;
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
                                <Link
                                    to={`/service/${service.slug}`}
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
