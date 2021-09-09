/* @flow */

import type {Element as ReactElement, Node as ReactNode} from "React";
import React, {useEffect, useState} from "react";
import _ from "underscore";

import * as gtm from "../google-tag-manager";
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
import icons from "../icons";
import Storage from "../storage";
import {MobileDetect} from "../effects/MobileDetect";

type Props = {
    service: Service,
}

function ServicePane({service}: Props): ReactNode {

    const [siblings, setSiblings] = useState<Array<Service>>([])

    const isMobile = MobileDetect()

    useEffect(() => {
        getSiblingServices();
    }, [service])


    const getSiblingServices = async(): Promise<void> => {
        let response = await service.getSiblingServices();
        setSiblings(response.objects)
    }


    const recordAlsoAtThisLocation = (service: Service) => {
        gtm.emit({
            event: "Other Services At Location Clicked",
            eventCat: "Other Services At Location Clicked",
            eventAction: null,
            eventLabel: `${location.pathname} - ${service.slug}`,
            sendDirectlyToGA: true,
        });
    }


    const renderServiceProvisions = (): ReactElement<"div"> => {
        if (_.isEmpty(service.serviceProvisions)) {
            return <div />;
        }

        return (
            <div className="serviceProvisions-container">
                <h3 className="serviceProvisions-header">
                    What you can get here
                </h3>
                <ul>
                    {service.serviceProvisions.map(
                        (provision, index) =>
                            <li key={index}>{provision}</li>
                    )}
                </ul>
            </div>
        );
    }

    const recordClick = (): void => {
        gtm.emit({
            event: "Google Maps Link Clicked",
            eventCat: "External Link Clicked",
            eventAction: "Google Maps Directions",
            eventLabel: window.location.pathname,
            sendDirectlyToGA: true,
        });
    }

    const renderSiblings = (): ReactElement<"div"> | ReactElement<"span"> => {

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
                                () => recordAlsoAtThisLocation(service)
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

    const renderDescription = (): ReactElement<"div"> => {
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
                    primaryText={service.name}
                    secondaryText={service.site.name}
                    bannerName="housing"
                />
                <AlertBannerList
                    state={service.Location()?.state}
                    screenLocation="servicePage"
                    format="inline"
                />

                <DebugServiceRecord object={service} />
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
                            <IndigenousServiceIcon object={service} />
                            <LgbtiqIcon object={service} />
                        </div>
                        {renderDescription()}
                    </div>

                    <div
                        className="provisions"
                        tabIndex="0"
                    >
                        <Eligibility {...service} />
                        {renderServiceProvisions()}
                        {!isMobile && renderSiblings()}
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
                                object={service.open}
                                serviceId={service.id}
                            />
                            <Accessibility
                                service={service}
                                withSpacer={true}
                            />
                            <Ndis
                                className="ndis"
                                compact={false}
                                object={service}
                                spacer={true}
                            />
                            <Address
                                location={service.Location()}
                                site={service.site}
                                withSpacer={true}
                            />
                            {Storage.getCoordinates() &&
                            service.Location().travelTime &&
                                <TransportTime
                                    location={service.Location()}
                                    withSpacer={true}
                                />
                            }
                            <GoogleMapsLink
                                to={service.Location()}
                                className={Storage.getCoordinates() ?
                                    "withTimes" : "withoutTimes"}
                                onClick={recordClick}
                                hideSpacer={true}
                            >
                                <span className="googleMapsLink">
                                    Get directions in Google Maps
                                    <icons.ExternalLink
                                        className="ExternalLinkIcon"
                                    />
                                </span>
                            </GoogleMapsLink>
                            <ContactMethods object={service} />
                            <Feedback object={service} />
                        </div>
                    </BoxedText>
                    {isMobile && renderSiblings()}
                </div>
            </div>
        </div>
    );
}

export default ServicePane
