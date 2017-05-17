/* @flow */

import React from "react";
import _ from "underscore";

import fixtures from "../../fixtures/services";
import sendEvent from "../google-tag-manager";
import ServiceFactory from "../../fixtures/factories/Service";

import Address from "./Address";
import CollapsedOpeningTimes from "./CollapsedOpeningTimes";
import Collapser from "./Collapser";
import ContactMethods from "./ContactMethods";
import DebugServiceRecord from "./DebugServiceRecord";
import Eligibility from "./Eligibility";
import TransportTime from "./TransportTime";
import GoogleMapsLink from "./GoogleMapsLink";
import Spacer from "./Spacer";
import LinkListItem from "./LinkListItem";
import BoxedText from "./BoxedText";
import BoxedTextDivider from "./BoxedTextDivider";
import Chevron from "../icons/Chevron";
import IndigenousServiceIcon from "./IndigenousServiceIcon";
import type {Service} from "../iss";

export default class ServicePane extends React.Component {
    props: {
        service: Service,
    };
    state: {siblings: ?Array<Service>};

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

    recordAlsoAtThisLocation(): void {
        sendEvent({
            event: "alsoAtThisLocation",
            listingName: this.props.service.name,
            crisis: this.props.service.crisis,
        });
    }

    recordSuggestChange(): void {
        sendEvent({
            event: "suggestServiceChange",
            service: this.props.service.id,
        });
    }

    render() {
        const object = this.props.service;

        return (
            <div className="ServicePane">
                <div className="header">
                    <h2 className="name">
                        {object.name}
                    </h2>
                    <p>
                        <IndigenousServiceIcon object={object} />
                    </p>
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

                <BoxedTextDivider />

                <BoxedText>
                    <div className="practicalities-container">
                        <CollapsedOpeningTimes
                            object={object.open}
                            serviceId={object.id}
                        />
                        <Spacer />

                        <GoogleMapsLink
                            className="plain-text"
                            to={object.Location()}
                        >
                            <Address location={object.Location()} />
                            <TransportTime location={object.Location()}/>
                        </GoogleMapsLink>

                        <Spacer />
                        <ContactMethods object={object} />
                    </div>
                </BoxedText>

                <div className="provisions">
                    <Eligibility {...object} />

                    {this.renderServiceProvisions()}
                    {this.renderSiblings()}
                </div>

                <a
                    className="suggestChange"
                    onClick={this.recordSuggestChange.bind(this)}
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
                <DebugServiceRecord object={object} />
            </div>
        );
    }

    renderServiceProvisions() {
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

    renderSiblings() {
        const siblings = this.state.siblings;

        if (!siblings) {
            return <span />;
        }

        if (_.isEmpty(siblings)) {
            return <span />;
        }

        return (
            <div className="siblings-container">
                <h3 className="siblings-header">
                    Also at this location
                </h3>
                <div className="List">
                    {siblings.map((service, index) =>
                        <LinkListItem
                            className="plain-text"
                            to={`/service/${service.slug}`}
                            key={index}
                            onClick={
                                this.recordAlsoAtThisLocation.bind(service)
                            }
                            primaryText={service.name}
                            secondaryText={service.shortDescription[0]}
                            rightIcon={<Chevron />}
                        />
                    )}
                </div>
            </div>
        );
    }
}
