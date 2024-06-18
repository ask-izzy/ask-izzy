/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";


import Service from "../iss/Service";
import {FmdGoodRounded} from "@mui/icons-material";


import AddToCompareButton from "./AddToCompareButton"
import ServiceProvisions from "./service/ServiceProvisions"
import CurrentOpeningTime from "./CurrentOpeningTime";
import Ndis from "./Ndis";
import { titleize } from "underscore.string";
import ScreenReader from "./ScreenReader";
import ListItem from "./ListItem";
import Link from "./base/Link";
import ResultListItemContact from "@/src/components/ResultListItemContact";


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
                <FmdGoodRounded aria-hidden={true} />
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
            <div className="my-list-result-title-container">
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


            <div className="my-list-result-content-container">
                <div className="my-list-result-information">
                    <div className="site_name">
                        {service.site.name}
                        <Ndis
                            compact={true}
                            object={service}
                        />
                    </div>
                    {service.location && renderLocation()}
                    <CurrentOpeningTime
                        className="opening_hours"
                        serviceOpening={service.open}
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
                </div>
                <ResultListItemContact
                    service={service}
                />
            </div>
        </ListItem>
    );
}

export default ResultListItem;
