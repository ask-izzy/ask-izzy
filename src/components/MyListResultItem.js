/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";

import icons from "../icons";
import Service from "../iss/Service";


import AddToCompareButton from "./AddToCompareButton"
import ServiceProvisions from "./service/ServiceProvisions"
import OpeningTimes from "./OpeningTimes";
import Ndis from "./Ndis";
import { titleize } from "underscore.string";
import ScreenReader from "./ScreenReader";
import ListItem from "./ListItem";
import Link from "./base/Link";


type Props = {
    service: Service,
    resultNumber: number,
}

function ResultListItem({
    service,
    resultNumber,
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

    return (
        <ListItem
            rootElement="li"
            className="plain-text MyListResultItem"
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
                </div>
                <AddToCompareButton serviceID={service.id}
                    serviceObj={service}
                />
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
        </ListItem>
    );
}

export default ResultListItem;
