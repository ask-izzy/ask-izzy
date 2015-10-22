/* @flow */

import React from "react";
import _ from "underscore";

import Address from "./Address";
import CollapsedOpeningTimes from "./CollapsedOpeningTimes";
import ContactMethods from "./ContactMethods";
import Eligibility from "./Eligibility";
import StaticMap from "./StaticMap";
import Collapser from "./Collapser";
import LinkListItem from "./LinkListItem";
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
        let response = await this.props.service.getSiblingServices();

        this.setState({siblings: response.objects});
    }

    render(): ReactElement {
        const object = this.props.service;

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

                    {this.renderAddress()}

                    <hr />
                    <ContactMethods object={object} />
                    <hr />
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

    renderAddress(): ReactElement {
        const location = this.props.service.Location();

        if (location.isConfidential()) {
            return (
                <Address location={location} />
            );
        } else {
            return (
                <Collapser
                    message={<Address location={location} />}
                    allowReclosing={true}
                >
                    <StaticMap
                        location={location}
                    />
                </Collapser>
            );
        }
    }

    renderServiceProvisions(): ReactElement {
        let object = this.props.service;

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
                <div className="List">
                    {this.state.siblings.map((service, index) =>
                        <LinkListItem
                            className="plain-text"
                            to={`/service/${service.slug}`}
                            key={index}
                            primaryText={service.name}
                            secondaryText={service.shortDescription}
                            rightIcon={<icons.Chevron />}
                        />
                    )}
                </div>
            </div>
        );
    }
}
