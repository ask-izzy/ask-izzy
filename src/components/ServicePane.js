/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import _ from "underscore";

import fixtures from "../../fixtures/services";
import * as gtm from "../google-tag-manager";
import ServiceFactory from "../../fixtures/factories/Service";

import Address from "./Address";
import Accessibility from "./Accessibility";
import CollapsedOpeningTimes from "./CollapsedOpeningTimes";
import Collapser from "./general/Collapser";
import ContactMethods from "./ContactMethods";
import DebugServiceRecord from "./DebugServiceRecord";
import Eligibility from "./Eligibility";
import Feedback from "./Feedback";
import HeaderBar from "./HeaderBar";
import Heading from "../components/base/Heading";
import DocLevel from "../components/helpers/DocLevel";
import TransportTime from "./TransportTime";
import GoogleMapsLink from "./GoogleMapsLink";
import Ndis from "./Ndis";
import LinkListItem from "./LinkListItem";
import BoxedText from "./BoxedText";
import Chevron from "../icons/Chevron";
import IndigenousServiceIcon from "./IndigenousServiceIcon";
import LgbtiqIcon from "./LgbtiqIcon";
import AlertBannerList from "../components/AlertBannerList";
import type {Service} from "../iss";
import ScreenReader from "./ScreenReader";

export default class ServicePane extends React.Component<{
    service: Service,
}, {siblings: ?Array<Service>}> {
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

    static sampleProps: any = {default: {
        service: ServiceFactory(fixtures.youthSupportNet),
    }};

    async getSiblingServices(): Promise<void> {
        let response = await this.props.service.getSiblingServices();

        this.setState({siblings: response.objects});
    }

    recordAlsoAtThisLocation: (
        (service: Service) => void
    ) = (service: Service): void => {
        gtm.emit({
            event: "Other Services At Location Clicked",
            eventCat: "Other Services At Location Clicked",
            eventLabel: `${location.pathname} - ${service.slug}`,
            sendDirectlyToGA: true,
        });
    }

    render(): ReactElement<"div"> {
        const object = this.props.service;
        return (
            <div className="ServicePane">
                <div
                    role="complementary"
                    aria-labelledby="header"
                >
                    <ScreenReader>
                        <span id="header">
                            Header.
                        </span>
                    </ScreenReader>
                    <HeaderBar
                        className="serviceDetailsHeader"
                        primaryText={object.name}
                        secondaryText={object.site.name}
                        bannerName="housing"
                    />
                    <AlertBannerList
                        state={object.Location()?.state}
                        screenLocation="servicePage"
                        format="inline"
                    />

                    <DebugServiceRecord object={object} />
                </div>
                <DocLevel>
                    <div
                        role="main"
                        aria-labelledby="serviceDetails"
                        className="row"
                    >
                        <ScreenReader>
                            <span id="serviceDetails">
                                Service details.
                            </span>
                        </ScreenReader>
                        <div
                            role="region"
                            className="leftColumn"
                            aria-labelledby="serviceDesc"
                        >
                            <ScreenReader>
                                <span id="serviceDesc">
                                    Service description.
                                </span>
                            </ScreenReader>
                            <div
                                className="header"
                                tabIndex="0"
                            >
                                <div>
                                    <IndigenousServiceIcon object={object} />
                                    <LgbtiqIcon object={object} />
                                </div>
                                <div className="description">
                                    <Collapser
                                        contentPreview={object.shortDescription
                                            .map((
                                                sentence, idx) =>
                                                <p key={idx}>{sentence}</p>
                                            )}
                                        expandMessage="Read more"
                                    >
                                        {object.descriptionSentences.map(
                                            (sentence, idx) =>
                                                <p key={idx}>{sentence}</p>
                                        )}
                                    </Collapser>
                                </div>
                            </div>
                            <section>
                                <Eligibility {...object} />
                            </section>
                            {this.renderServiceProvisions()}
                            <section>
                                {this.renderSiblings()}
                            </section>
                        </div>
                        <div
                            role="region"
                            aria-labelledby="serviceInfo"
                            className="rightColumn"
                        >
                            <BoxedText>
                                <ScreenReader>
                                    <h4 id="serviceInfo">
                                        Service Info.
                                    </h4>
                                </ScreenReader>
                                <div className="practicalities-container">
                                    <CollapsedOpeningTimes
                                        object={object.open}
                                        serviceId={object.id}
                                    />
                                    <Accessibility object={object} />
                                    <Ndis
                                        className="ndis"
                                        compact={false}
                                        object={object}
                                        spacer={true}
                                    />
                                    <GoogleMapsLink
                                        className="plain-text"
                                        to={object.Location()}
                                    >
                                        <Address location={object.Location()} />
                                        <TransportTime
                                            location={object.Location()}
                                            withoutLink={true}
                                        />
                                    </GoogleMapsLink>
                                    <ContactMethods object={object} />
                                    <Feedback object={object} />
                                </div>
                            </BoxedText>
                        </div>
                    </div>
                </DocLevel>
            </div>
        );
    }

    renderServiceProvisions(): ReactElement<"div"> {
        let object = this.props.service;

        if (_.isEmpty(object.serviceProvisions)) {
            return <div />;
        }

        return (
            <div className="serviceProvisions-container">
                <Heading className="serviceProvisions-header">
                    What you can get here
                </Heading>
                <ul>
                    {object.serviceProvisions.map(
                        (provision, index) =>
                            <li key={index}>{provision}</li>
                    )}
                </ul>
            </div>
        );
    }

    renderSiblings(): ReactElement<"div"> | ReactElement<"span"> {
        const siblings = this.state.siblings;

        if (!siblings) {
            return <span />;
        }

        if (_.isEmpty(siblings)) {
            return <span />;
        }

        return (
            <div className="siblings-container">
                <h3
                    tabIndex="0"
                    className="siblings-header"
                    aria-label="Also at this location."
                >
                    Also at this location
                </h3>
                <div className="List">
                    {siblings.map((service, index) =>
                        <LinkListItem
                            className="plain-text"
                            to={`/service/${service.slug}`}
                            key={index}
                            onClick={
                                () => this.recordAlsoAtThisLocation(service)
                            }
                            aria-label={`${service.name}. ${
                                service.shortDescription[0]
                            }.`}
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
