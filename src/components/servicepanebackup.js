import React, { useEffect, useState } from "react";
import _ from "underscore";
import Address from "./Address";
import Accessibility from "./Accessibility";
import CollapsedOpeningTimes from "./CollapsedOpeningTimes";
import Collapser from "./general/Collapser";
import ContactMethods from "./ContactMethods";
import DebugServiceRecord from "./DebugServiceRecord";
import Eligibility from "./Eligibility";
import Cost from "./CostField";
import Feedback from "./Feedback";
import ImportantInformation from "./ImportantInformation";
import LanguagesAvailable from "@/src/components/LanguagesAvailable";
import TransportTime from "./TransportTime";
import GoogleMapsLink from "./GoogleMapsLink";
import Ndis from "./Ndis";
import LinkListItem from "./LinkListItem";
import BoxedText from "./BoxedText";
import Chevron from "../icons/Chevron";
import IndigenousServiceIcon from "./IndigenousServiceIcon";
import LgbtiqIcon from "./LgbtiqIcon";
import AlertBannerList from "../components/AlertBannerList";
import AddToCompareButton from "../components/AddToCompareButton";
import Service from "../iss/Service";
import icons from "../icons";
import ShareButton from "../components/ShareButton";
import Storage from "../storage";
import ScreenReader from "./ScreenReader";
import FormatText from "./FormatText";
import { getSiblingServices } from "../iss/load-services";
import { MobileDetect } from "../effects/MobileDetect";

type Props = {
    service: Service,
};

function ServicePane({ service }: Props): ReactNode {
    const [siblings, setSiblings] = useState<Array<Service>>([]);
    const [isCollapsed, setIsCollapsed] = useState(true); // State to manage global collapse/expand
    const [collapserStates, setCollapserStates] = useState({
        openingTimes: true,
        languages: true,
        contactMethods: true,
    }); // State to track individual collapsers [experimenting :)]

    const isMobile = MobileDetect(799);

    useEffect(() => {
        async function loadSiblings(): Promise<void> {
            setSiblings(await getSiblingServices(service));
        }
        loadSiblings();
    }, [service]);

    const toggleAll = () => {
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        setCollapserStates({
            openingTimes: newCollapsedState,
            languages: newCollapsedState,
            contactMethods: newCollapsedState,
        });
    };

    const handleToggle = (key) => (collapsed) => {
        setCollapserStates(prevState => ({
            ...prevState,
            [key]: collapsed,
        }));
    };

    const allExpanded = !Object.values(collapserStates).some(state => state);

    const renderServiceProvisions = (): ReactElement<"div"> => {
        if (_.isEmpty(service.serviceProvisions)) {
            return <div />;
        }

        return (
            <div className="serviceProvisions-container">
                <h3 className="serviceProvisions-header">What you can get here</h3>
                <ul>
                    {service.serviceProvisions.map((provision, index) => (
                        <li key={index}>{provision}</li>
                    ))}
                </ul>
            </div>
        );
    };

    const renderSiblings = (): ReactElement<"div"> | ReactElement<"span"> => {
        if (!siblings) {
            return <span />;
        }

        if (_.isEmpty(siblings)) {
            return <span />;
        }

        return (
            <div className="siblings-container"
                key="siblings-container"
            >
                <h3 className="siblings-header"
                    aria-label="Also at this location."
                >
                    Also at this location
                </h3>
                <div className="List">
                    {siblings.map((service, index) => (
                        <LinkListItem
                            className="plain-text"
                            to={`/service/${service.slug}`}
                            key={index}
                            analyticsEvent={{
                                event: "Link followed - Other services at location",
                                eventAction: "Other services at location",
                                eventLabel: `${service.slug}`,
                                sendDirectlyToGA: true,
                            }}
                            aria-label={`${service.name}. ${service.shortDescription[0]}.`}
                            primaryText={
                                <>
                                    {service.name}
                                    <ScreenReader>.</ScreenReader>
                                </>
                            }
                            secondaryText={service.shortDescription[0]}
                            rightIcon={<Chevron />}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const renderDescription = (): ReactElement<"div"> => {
        let description = service.descriptionSentences.map((sentence, idx) => (
            <FormatText key={idx}>{sentence}</FormatText>
        ));

        if (service.descriptionRemainder.length > 0) {
            description = (
                <Collapser
                    contentPreview={service.shortDescription.map((sentence, idx) => (
                        <p key={idx}>{sentence}</p>
                    ))}
                    expandMessage="Read more"
                    analyticsEvent={{
                        event: `Action Triggered - Service Description`,
                        eventAction: "Show full service description",
                        eventLabel: null,
                    }}
                >
                    {description}
                </Collapser>
            );
        }

        return <div className="description">{description}</div>;
    };

    const addToCompareButtonComponent = (
        <AddToCompareButton
            hasTextDescription={true}
            service={service}
        />
    );

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
            );
        } else if (typeOfDevice === "mobile" && isMobile) {
            return (
                <div className="compare-share-container mobile">
                    <ShareButton
                        hasTextDescription={true}
                        services={[service]}
                    />
                    {addToCompareButtonComponent}
                </div>
            );
        }
        return <></>;
    }

    return (
        <div className="ServicePane">
            <div>
                <AlertBannerList state={service.location?.state}
                    screenLocation="servicePage"
                    format="inline"
                />
                <DebugServiceRecord object={service} />
            </div>
            <main aria-label="Service details"
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
                    <Cost
                        catchment={service.catchment}
                        cost={service.cost}
                    />
                    {renderServiceProvisions()}
                </div>

                <div className="boxed-text-container">
                    {renderCompareShare("web")}
                    <Collapser
                        header="Service Details"
                        expandMessage={allExpanded ? "Collapse all" : "Expand all"}
                        collapseMessage="Collapse all"
                        analyticsEvent={{
                            event: `Action Triggered - Opening Times`,
                            eventAction: "Show practicalities",
                            eventLabel: null,
                        }}
                        className="Boxed-Text-Collapser"
                        onClick={toggleAll}
                        externalCollapsed={isCollapsed}
                    />
                    <BoxedText>
                        <div className="boxed-text-content">
                            <CollapsedOpeningTimes
                                service={service}
                                externalCollapsed={collapserStates.openingTimes}
                                onToggle={handleToggle("openingTimes")}
                            />
                            <Accessibility
                                service={service}
                                withSpacer={true}
                            />
                            <Ndis
                                compact={false}
                                object={service}
                                withSpacer={true}
                            />
                            <Address
                                location={service.location}
                                site={service.site}
                                withSpacer={true}
                            />
                            {service.location && service.travelTimes && (
                                <TransportTime
                                    location={service.location}
                                    withSpacer={true}
                                    travelTimes={service.travelTimes}
                                />
                            )}
                            {!service.location?.isConfidential() && (
                                <GoogleMapsLink
                                    to={service.location}
                                    className={Storage.getUserGeolocation() ? "withTimes" : "withoutTimes"}
                                    hideSpacer={true}
                                >
                                    <span className="googleMapsLink">
                                        Get directions in Google Maps
                                        <icons.ExternalLink className="ExternalLinkIcon" />
                                    </span>
                                </GoogleMapsLink>
                            )}
                            {service.languages.length > 0 && (
                                <LanguagesAvailable
                                    service={service}
                                    externalCollapsed={collapserStates.languages}
                                    onToggle={handleToggle("languages")}
                                >
                                    {service.languages}
                                </LanguagesAvailable>
                            )}
                            <ContactMethods
                                object={service}
                                externalCollapsed={collapserStates.contactMethods}
                                onToggle={handleToggle("contactMethods")}
                            />
                            <ImportantInformation object={service} />
                        </div>
                    </BoxedText>
                    <Feedback object={service} />
                </div>
                {renderSiblings()}
            </main>
        </div>
    );
}

export default ServicePane;
