/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";

import Map from "../icons/map.svg";
import Service from "../iss/Service";

import DebugContainer from "./DebugContainer";
import DebugQueryScore from "./DebugQueryScore";
import DebugServiceRecord from "./DebugServiceRecord";

import Eligibility from "./Eligibility";
import ServiceProvisions from "./service/ServiceProvisions"
import Accessibility from "./Accessibility";
import OpeningTimes from "./OpeningTimes";
import Ndis from "./Ndis";
import Loading from "../icons/loading.svg";
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
            <span
                className="location"
                aria-label={`${suburb}.`}
            >
                <Map
                    aria-label="Location"
                />
                {titleize(suburb)}
            </span>
        );
    }

    const renderTravelTimes = (): ReactNode => {
        if (service.location && service.travelTimes) {
            return (
                <TransportTime
                    location={service.location}
                    compact={true}
                    travelTimes={service.travelTimes}
                />
            )
        }
        return null
    }

    return (
        <ListItem
            className="plain-text ResultListItem"
        >
            <div className="name">
                <Link
                    to={`/service/${service.slug}`}
                    analyticsEvent={{
                        event: `Link Followed - Service Result`,
                        eventAction: "Service result",
                        eventLabel: `Standard service - number ` +
                            `${resultNumber}`,
                    }}
                >
                    <h2 aria-label={`${service.name}.`}>
                        {service.name}
                    </h2>
                </Link>
                <div className="flags">
                    <IndigenousServiceIcon object={service} />
                    <LgbtiqIcon object={service} />
                </div>
            </div>
            <div
                className="site_name"
                aria-label={`${service.site.name}.`}
            >
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
                {service.shortDescription.map(
                    (sentence, i) =>
                        <p key={i}>{sentence}</p>
                )}
            </div>
            <Eligibility {...service} />
            <Accessibility service={service} />
            <ScreenReader>
                Travel times.
            </ScreenReader>
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
