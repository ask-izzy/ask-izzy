import React, {useEffect, useState, ReactNode} from "react";
import _ from "underscore";

import * as gtm from "@/src/google-tag-manager";
import Address from "@/src/components/Address";
import Accessibility from "@/src/components/Accessibility";
import CollapsedOpeningTimes from "@/src/components/CollapsedOpeningTimes";
import Collapser from "@/src/components/general/Collapser";
import ContactMethods from "@/src/components/ContactMethods";
import DebugServiceRecord from "@/src/components/DebugServiceRecord";
import Eligibility from "@/src/components/Eligibility";
import Feedback from "@/src/components/Feedback";
import ImportantInformation from "@/src/components/ImportantInformation"
import HeaderBar from "@/src/components/HeaderBar";
import TransportTime from "@/src/components/TransportTime";
import GoogleMapsLink from "@/src/components/GoogleMapsLink";
import Ndis from "@/src/components/Ndis";
import LinkListItem from "@/src/components/LinkListItem";
import BoxedText from "@/src/components/BoxedText";
import Chevron from "@/src/icons/Chevron";
import ExternalLink from "@/src/icons/ExternalLink";
import IndigenousServiceIcon from "@/src/components/IndigenousServiceIcon";
import LgbtiqIcon from "@/src/components/LgbtiqIcon";
import AlertBannerList from "@/src/components/AlertBannerList";
import AddToCompareButton from "@/src/components/AddToCompareButton"
import Service from "@/src/iss/Service";
import ShareButton from "../components/ShareButton"
import Storage from "@/src/storage";
import ScreenReader from "@/src/components/ScreenReader";
import UrlsToLinks from "@/src/components/UrlsToLink"
import {MobileDetect} from "@/src/effects/MobileDetect";
import {getSiblingServices} from "@/src/iss/load-services"

type Props = {
    service: Service,
}

function ServicePane({service}: Props) {
    const [siblings, setSiblings] = useState<Array<Service>>([])
    const isMobile = MobileDetect(799)

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


    const renderServiceProvisions = () => {
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
                            <li key={index}>{provision}</li>,
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

    const renderSiblings = () => {

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
                        />,
                    )}
                </div>
            </div>
        );
    }

    const renderDescription = () => {
        let description: ReactNode = service
            .descriptionSentences.map(
                (sentence, idx) =>
                    <UrlsToLinks key={idx}>{sentence}</UrlsToLinks>,
            )

        if (service.descriptionRemainder.length > 0) {
            description = (
                <Collapser
                    contentPreview={service.shortDescription.map(
                        (sentence, idx) => <p key={idx}>{sentence}</p>,
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

    const addToCompareButtonComponent = (
        <AddToCompareButton
            hasTextDescription={true}
            service={service}
        />
    )

    function renderCompareShare(typeOfDevice) {
        // required due to different positioning
        // with mobile and computer rendering
        if (typeOfDevice === "web" && !isMobile) {
            return (
                <div className="compare-share-container">
                    <ShareButton
                        hasTextDescription={true}
                        services={[service]}
                    />
                    {addToCompareButtonComponent}
                </div>
            )
        } else if (typeOfDevice === "mobile" && isMobile) {
            return (
                <div className="compare-share-container mobile">
                    <ShareButton
                        hasTextDescription={true}
                        services={[service]}
                    />
                    {addToCompareButtonComponent}
                </div>
            )
        }
        return <></>

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
                <div className="header">
                    {renderCompareShare("mobile")}
                    <div>
                        <IndigenousServiceIcon object={service} />
                        <LgbtiqIcon object={service} />
                    </div>
                    {renderDescription()}
                </div>

                <div className="provisions">
                    <Eligibility {...service} />
                    {renderServiceProvisions()}
                </div>
                <div className= "boxed-text-container">
                    {renderCompareShare("web")}
                    <BoxedText>
                        <div className="practicalities-container">
                            <CollapsedOpeningTimes
                                object={service.open}
                            />
                            <Accessibility
                                service={service}
                                withSpacer={true}
                            />
                            <Ndis
                                object={service}
                                compact={false}
                                withSpacer={true}
                            />
                            <Address
                                location={service.location}
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
                                    <ExternalLink
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
                </div>

                { renderSiblings() }
            </main>
        </div>
    );
}

export default ServicePane
