import React from "react";
import {titleize} from "underscore.string";

import Map from "@/src/icons/Map.js";
import Service from "@/src/iss/Service.js";
import AddToCompareButton from "@/src/components/AddToCompareButton.js"
import ServiceProvisions from "@/src/components/service/ServiceProvisions.js"
import OpeningTimes from "@/src/components/OpeningTimes.js";
import Ndis from "@/src/components/Ndis.js";
import ScreenReader from "@/src/components/ScreenReader.js";
import ListItem from "@/src/components/ListItem.js";
import Link from "@/src/components/base/Link.js";



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
