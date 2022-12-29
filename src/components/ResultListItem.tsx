import React from "react";
import {titleize} from "underscore.string";

import Map from "@/src/icons/Map.js";
import Loading from "@/src/icons/Loading.js";
import Service from "../iss/Service.js";
import DebugContainer from "@/src/components/DebugContainer.js";
import DebugQueryScore from "@/src/components/DebugQueryScore.js";
import DebugServiceRecord from "@/src/components/DebugServiceRecord.js";
import Eligibility from "@/src/components/Eligibility.js";
import AddToCompareButton from "@/src/components/AddToCompareButton.js"
import ShareButton from "@/src/components/ShareButton.js"
import ServiceProvisions from "@/src/components/service/ServiceProvisions.js"
import Accessibility from "@/src/components/Accessibility.js";
import OpeningTimes from "@/src/components/OpeningTimes.js";
import Ndis from "@/src/components/Ndis.js";
import TransportTime from "@/src/components/TransportTime.js";
import IndigenousServiceIcon from "@/src/components/IndigenousServiceIcon.js";
import LgbtiqIcon from "@/src/components/LgbtiqIcon.js";
import ScreenReader from "@/src/components/ScreenReader.js";
import ListItem from "@/src/components/ListItem.js";
import Link from "@/src/components/base/Link.js";
import type {travelTimesStatus} from "@/src/hooks/useTravelTimesUpdater.js";


type Props = {
    service: Service,
    resultNumber: number,
    travelTimesStatus: travelTimesStatus | null,
}

function ResultListItem({
    service,
    resultNumber,
    travelTimesStatus,
}: Props) {
    const renderLocation = () => {
        if (!service.location) {
            return null
        }
        let suburb = service.location.suburb;

        if (service.location.isConfidential()) {
            suburb = "Confidential location";
        }

        return (
            <span className="location">
                <Map aria-hidden={true} />
                <ScreenReader>
                    Service located in
                </ScreenReader>
                {titleize(suburb)}
            </span>
        );
    }

    const renderTravelTimes = () => {
        if (service.location && service.travelTimes) {
            return <>
                <ScreenReader>
                    Travel times
                </ScreenReader>
                <TransportTime
                    location={service.location}
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
                        service={service}
                    />
                </div>
            </div>
            <div className="site_name">
                {service.site.name}
                <Ndis
                    compact={true}
                    object={service}
                />
            </div>
            {service.location && renderLocation()}
            <OpeningTimes
                object={service.open}
            />
            <ServiceProvisions
                service={service}
            />
            <div className="description">
                {service.shortDescription?.map(
                    (sentence, i) =>
                        <p key={i}>{sentence}</p>,
                )}
            </div>
            <Eligibility {...service} />
            <Accessibility service={service} />
            {!service.travelTimes && travelTimesStatus === "loading" &&
                <Loading className="small"/>
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
