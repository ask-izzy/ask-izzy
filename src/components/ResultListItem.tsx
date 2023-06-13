import React from "react";
import {titleize} from "underscore.string";

import Map from "@/src/icons/Map";
import Loading from "@/src/icons/Loading";
import Service from "../iss/Service";
import DebugContainer from "@/src/components/DebugContainer";
import DebugQueryScore from "@/src/components/DebugQueryScore";
import DebugServiceRecord from "@/src/components/DebugServiceRecord";
import Eligibility from "@/src/components/Eligibility";
import AddToCompareButton from "@/src/components/AddToCompareButton"
import ShareButton from "@/src/components/ShareButton"
import ServiceProvisions from "@/src/components/service/ServiceProvisions"
import Accessibility from "@/src/components/Accessibility";
import OpeningTimes from "@/src/components/OpeningTimes";
import Ndis from "@/src/components/Ndis";
import TransportTime from "@/src/components/TransportTime";
import IndigenousServiceIcon from "@/src/components/IndigenousServiceIcon";
import LgbtiqIcon from "@/src/components/LgbtiqIcon";
import ScreenReader from "@/src/components/ScreenReader";
import ListItem from "@/src/components/ListItem";
import Link from "@/src/components/base/Link";
import type {travelTimesStatus} from "@/src/hooks/useTravelTimesUpdater";


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
