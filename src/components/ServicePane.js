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
import ImportantInformation from "./ImportantInformation"
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
import Service from "../iss/Service";
import icons from "../icons";
import Storage from "../storage";
import ScreenReader from "./ScreenReader";
import {MobileDetect} from "../effects/MobileDetect";
import UrlsToLinks from "./UrlsToLink"
import {getSiblingServices} from "../iss/load-services"

type Props = {
    service: Service,
}

function ServicePane({service}: Props): ReactNode {
    const [siblings, setSiblings] = useState<Array<Service>>([])

    const isMobile = MobileDetect()

    useEffect(() => {
        async function loadSiblings(): Promise<void> {
            setSiblings(await getSiblingServices(service))
        }
        loadSiblings();
    }, [service])

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
                            primaryText={<>
                                {service.name}
                                <ScreenReader>.</ScreenReader>
                            </>}
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
                    <UrlsToLinks key={idx}>{sentence}</UrlsToLinks>
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
            <div>
                <HeaderBar
                    className="serviceDetailsHeader"
                    primaryText={service.name}
                    secondaryText={service.site.name}
                    bannerName="housing"
                />
                <AlertBannerList
                    state={service.location?.state}
                    screenLocation="servicePage"
                    format="inline"
                />

                <DebugServiceRecord object={service} />
            </div>
            <main
                aria-label="Service details"
                className="row"
            >
                <div
                    role="region"
                    className="leftColumn"
                    aria-label="Service description"
                >
                    <div className="header">
                        <div>
                            <IndigenousServiceIcon object={service} />
                            <LgbtiqIcon object={service} />
                        </div>
                        {renderDescription()}
                    </div>

                    <div className="provisions">
                        <Eligibility {...service} />
                        {renderServiceProvisions()}
                        {!isMobile && renderSiblings()}
                    </div>
                </div>
                <div
                    role="region"
                    aria-label="Service Info"
                    className="rightColumn"
                >
                    <BoxedText>
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
                                location={service.location}
                                site={service.site}
                                withSpacer={true}
                            />
                            {service.location && service.travelTimes &&
                                <TransportTime
                                    location={service.location}
                                    withSpacer={true}
                                    travelTimes={service.travelTimes}
                                />
                            }
                            {!service.location?.isConfidential() &&
                            <GoogleMapsLink
                                to={service.location}
                                className={Storage.getUserGeolocation() ?
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
                            }
                            <ContactMethods object={service} />
                            <ImportantInformation object={service}/>
                            <Feedback object={service} />
                        </div>
                    </BoxedText>
                    {isMobile && renderSiblings()}
                </div>
            </main>
        </div>
    );
}

export default ServicePane
