/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";

import icons from "../icons";
import Service from "../iss/Service";

import DebugContainer from "./DebugContainer";
import DebugQueryScore from "./DebugQueryScore";
import DebugServiceRecord from "./DebugServiceRecord";

import Eligibility from "./Eligibility";
import AddToCompareButton from "./AddToCompareButton"
import ShareButton from "./ShareButton"
import ServiceProvisions from "./service/ServiceProvisions"
import Accessibility from "./Accessibility";
import OpeningTimes from "./OpeningTimes";
import Ndis from "./Ndis";
import TransportTime from "./TransportTime";
import IndigenousServiceIcon from "./IndigenousServiceIcon";
import LgbtiqIcon from "./LgbtiqIcon";
import { titleize } from "underscore.string";
import ScreenReader from "./ScreenReader";
import ListItem from "./ListItem";
import Link from "./base/Link";
import type {travelTimesStatus} from "../hooks/useTravelTimesUpdater";


type Props = {
    service: Service,
    resultNumber: number,
    travelTimesStatus: travelTimesStatus,
}

function ResultListItem({
    service,
    resultNumber,
    travelTimesStatus,
}: Props): ReactNode {
    const renderLocation = (): ?ReactElement<"span"> => {
        if (!service.location) {
            return null
        }
        let suburb = service.location.suburb;

        if (service.location.isConfidential()) {
            suburb = "Confidential location";
        }

        return (
            <span className="location">
                <icons.Map aria-hidden={true} />
                <ScreenReader>
                    Service located in
                </ScreenReader>
                {titleize(suburb)}
            </span>
        );
    }

    const renderTravelTimes = (): ReactNode => {
        if (service.location && service.travelTimes) {
            return <>
                <ScreenReader>
                    Travel times
                </ScreenReader>
                <TransportTime
                    location={service.location}
                    compact={true}
                    travelTimes={service.travelTimes}
                />
            </>
        }
        return null
    }

    return (
        <ListItem
            rootElement="li"
            className="plain-text ResultListItem"
        >
            <div className="title-container">
                <div className="name">
                    <Link
                        to={`/service/${service.slug}`}
                        analyticsEvent={{
                            event: `Link Followed - Service Result`,
                            eventAction: "Service result",
                            eventLabel: `Standard service - number ` +
                                `${resultNumber}`,
                        }}
                        aria-label={`Service: ${service.name}`}
                    >
                        <h2>{service.name}</h2>
                    </Link>
                    <div className="flags">
                        <IndigenousServiceIcon object={service} />
                        <LgbtiqIcon object={service} />
                    </div>
                </div>
                <div className="compare-share-container">
                    <ShareButton services={[service]} />
                    <AddToCompareButton
                        serviceID={service.id}
                    />
                </div>
            </div>
            <div className="site_name">
                {service.site.name}
                <Ndis
                    className="ndis"
                    compact={true}
                    object={service}
                />
            </div>
            {service.location && renderLocation()}
            <OpeningTimes
                className="opening_hours"
                object={service.open}
            />
            <ServiceProvisions
                service={service}
            />
            <div className="description">
                {service.shortDescription?.map(
                    (sentence, i) =>
                        <p key={i}>{sentence}</p>
                )}
            </div>
            <Eligibility {...service} />
            <Accessibility service={service} />
            {!service.travelTimes && travelTimesStatus === "loading" &&
                <icons.Loading className="small"/>
            }
            {service.travelTimes && renderTravelTimes()}
            <DebugServiceRecord object={service} />
            {service._explanation &&
                <DebugContainer message="Query score">
                    <DebugQueryScore expl={service._explanation} />
                </DebugContainer>
            }
        </ListItem>
    );
}

export default ResultListItem;
