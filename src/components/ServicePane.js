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
            eventAction: null,
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
                            {this.renderDescription(object)}
                        </div>

                        <div
                            className="provisions"
                            tabIndex="0"
                        >
                            <Eligibility {...object} />
                            {this.renderServiceProvisions()}
                            {this.renderSiblings()}
                        </div>
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

    renderDescription(service: Service): ReactElement<"div"> {
        let description = service
            .descriptionSentences.map(
                (sentence, idx) =>
                    <p key={idx}>{sentence}</p>
            )

        if (service.descriptionRemainder.length > 0) {
            description = (
                <Collapser
                    contentPreview={service.shortDescription.map(
                        (sentence, idx) => <p key={idx}>{sentence}</p>
                    )}
                    expandMessage="Read more"
                    analyticsEvent={{
                        event: `Action Triggered - Service Description`,
                        eventAction: "Show full service description",
                        eventLabel: null,
                    }}
                >
                    {description}
                </Collapser>
            )
        }

        return (
            <div className="description">
                {description}
            </div>
        )
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
                            analyticsEvent={{
                                event: "Link Followed - Other Service",
                                eventAction: "Other service at location",
                                eventLabel: `${service.id}`,
                            }}
                        />
                    )}
                </div>
            </div>
        );
    }
}
