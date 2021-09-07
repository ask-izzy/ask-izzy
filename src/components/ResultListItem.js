/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React, {useEffect, useState} from "react";

import icons from "../icons";
import iss from "../iss";

import DebugContainer from "./DebugContainer";
import DebugQueryScore from "./DebugQueryScore";
import DebugServiceRecord from "./DebugServiceRecord";

import Eligibility from "./Eligibility";
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
import Storage from "../storage";
import Maps, {MapsApi} from "../maps";
import storage from "../storage";
import Location from "../iss/Location";

type Props = {
    service: iss.Service,
    resultNumber: number,
    reFetchTravelTimes?: boolean,
}

function ResultListItem(
    {
        service,
        resultNumber,
        reFetchTravelTimes = false,
    }: Props): ReactNode {

    // We set the location as an individual state variable because the travel
    // times can be set on the results page not just on the location question.
    // if a user sets their coordinates there, this needs to reflect that with
    // the location travel times
    const [location, setLocation] = useState<Location>(service.Location())
    const [loading, setLoading] = useState<boolean>(false)

    /**
     * This function sets the travel times per service
     * @param params - Accepts an object of DistanceMatrixRequest params
     * @return {Promise<void>} - returns nothing
     */
    const travelTimes = async(params: Object): Promise<void> => {

        // stores the new travel times
        const transportTimes = []
        const maps: MapsApi = await Maps();

        if (!maps) {
            return;
        }

        const distanceMatrixService = new maps.api
            .DistanceMatrixService()

        const getTimes = async(mode) => {
            let rows = [];
            await distanceMatrixService
                .getDistanceMatrix(
                    {
                        unitSystem: maps.api.UnitSystem.METRIC,
                        travelMode: mode,
                        ...params,
                    },
                    (response) => (rows = response.rows),
                )

            // We only need the object that houses the distance/duration
            const time = rows?.[0]?.elements?.[0]

            if (time && time?.status === "OK") {
                transportTimes.push({...time, mode})
            }
        }

        if (distanceMatrixService) {
            // The order of the modes array set the
            // order the travel times appear in
            const transportModes = ["WALKING", "TRANSIT", "DRIVING"];
            for (let i = 0; i < transportModes.length; i++) {
                await getTimes(transportModes[i])
            }

            // Because we are fetching new
            // travel times we need to remove
            // this service from the cache
            // so when you view the service details
            // it will have the new times
            window.IzzyServiceCache.del(service.id)

            // sets the new location
            setLocation(new Location({...location}, transportTimes))
            setLoading(false);
        } else {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (reFetchTravelTimes) {
            const coords = storage.getCoordinates();
            const destination = service.location?.point;
            if (coords && destination) {
                setLoading(true);
                travelTimes({
                    origins: [`${`${coords.latitude},${coords.longitude}`}`],
                    destinations: [`${destination.lat},${destination.lon}`],
                    transitOptions: {departureTime: new Date()},
                })
            }
        }
    }, [reFetchTravelTimes])

    const renderLocation = (): ReactElement<"span"> => {
        let suburb = location.suburb;

        if (location.isConfidential()) {
            suburb = "Confidential location";
        }

        return (
            <span
                className="location"
                aria-label={`${suburb}.`}
            >
                <icons.Map
                    aria-label="Location"
                />
                {titleize(suburb)}
            </span>
        );
    }

    const renderTravelTimes = (): ReactNode => {
        if (Storage.getCoordinates()) {
            return (
                <TransportTime
                    location={location}
                    compact={true}
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
            {location && renderLocation()}
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
            {location?.travelTime && renderTravelTimes()}
            {!location?.travelTime && loading &&
            <icons.Loading className="small"/> }
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
