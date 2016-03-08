/* @flow */

import React from "react";
import _ from "underscore";

import Address from "./Address";
import CollapsedOpeningTimes from "./CollapsedOpeningTimes";
import Collapser from "./Collapser";
import ContactMethods from "./ContactMethods";
import Eligibility from "./Eligibility";
import TransportTime from "./TransportTime";
import GoogleMapsLink from "./GoogleMapsLink";
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
                <div className="header">
                    <h2 className="name">{object.name}</h2>
                    <h3 className="description">
                        {object.shortDescription.map((sentence, idx) =>
                            <p key={idx}>{sentence}</p>
                        )}
                        {object.descriptionRemainder.length ?
                            <Collapser message="Read more">
                                {object.descriptionRemainder.map(
                                    (sentence, idx) =>
                                        <p key={idx}>{sentence}</p>
                                )}
                            </Collapser>
                            : null
                        }
                    </h3>

                </div>

                <div className="header-practicalities-divider">
                    <hr />
                </div>

                <div className="practicalities">
                    <div className="practicalities-container">
                        <CollapsedOpeningTimes object={object.open} />
                        <hr />

                        <GoogleMapsLink
                            className="plain-text"
                            to={object.Location()}
                        >
                            <Address location={object.Location()} />
                            <TransportTime location={object.Location()}/>
                        </GoogleMapsLink>

                        <hr />
                        <ContactMethods object={object} />
                    </div>
                </div>

                <div className="header-provisions-divider"/>

                <div className="provisions">
                    <Eligibility {...object} />

                    {this.renderServiceProvisions()}
                    {this.renderSiblings()}
                </div>

                <a
                    className="suggestChange"
                    href={
                        "mailto:database@infoxchange.org" +
                        "?subject=" +
                        encodeURIComponent(`Ask Izzy changes: ${object.id}`) +
                        "&body=" +
                        encodeURIComponent(
                            `Contact name:

                            Contact number:

                            Contact email:

                            Details of change:

                            `.replace(/^ +/gm, "")
                        )
                    }
                >
                    Report an error
                </a>
            </div>
        );
    }

    renderServiceProvisions(): ReactElement {
        let object = this.props.service;

        if (_.isEmpty(object.serviceProvisions)) {
            return <div />;
        }

        return (
            <div className="serviceProvisions-container">
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
            <div className="siblings-container">
                <h3 className="siblings-header">
                    Also at this location
                </h3>
                <div className="List">
                    {this.state.siblings.map((service, index) =>
                        <LinkListItem
                            className="plain-text"
                            to={`/service/${service.slug}`}
                            key={index}
                            primaryText={service.name}
                            secondaryText={service.shortDescription[0]}
                            rightIcon={<icons.Chevron />}
                        />
                    )}
                </div>
            </div>
        );
    }
}
