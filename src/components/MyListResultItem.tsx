import React from "react";
import {titleize} from "underscore.string";

import Map from "@/src/icons/Map";
import Service from "@/src/iss/Service";
import AddToCompareButton from "@/src/components/AddToCompareButton"
import ServiceProvisions from "@/src/components/service/ServiceProvisions"
import OpeningTimes from "@/src/components/OpeningTimes";
import Ndis from "@/src/components/Ndis";
import ScreenReader from "@/src/components/ScreenReader";
import ListItem from "@/src/components/ListItem";
import Link from "@/src/components/base/Link";


type Props = {
    service: Service,
    resultNumber: number,
}

function ResultListItem({
    service,
    resultNumber,
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
                <AddToCompareButton service={service}/>
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
        </ListItem>
    );
}

export default ResultListItem;
