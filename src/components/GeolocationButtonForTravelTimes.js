/* @flow */

import type {Element as ReactElement} from "react"
import React, {useEffect} from "react";
import storage from "../storage";
import GeolocationButton from "./GeolocationButton";
import icons from "../icons";
import useTravelTimesUpdater from "../hooks/useTravelTimesUpdater"
import type {travelTimesStatus} from "../hooks/useTravelTimesUpdater";
import Service from "../iss/Service"

type Props = {
    showMessage?: boolean,
    servicesToUpdateTravelTimes: Array<Service>,
    onTravelTimesStatusChange: (travelTimesStatus) => void,
}

/**
 * Renders the "Get your current location" catch on the results page,
 * to allow the user to set their location if they want travel times
 * @return {JSX.Element} - Returns the travel times catch component
 */
function GeolocationButtonForTravelTimes({
    servicesToUpdateTravelTimes,
    showMessage = true,
    onTravelTimesStatusChange,
}: Props): ReactElement<"div"> {

    const {
        travelTimesStatus,
        loadTravelTimes,
        clearTravelTimes,
    } = useTravelTimesUpdater(servicesToUpdateTravelTimes)

    useEffect(() => {
        onTravelTimesStatusChange(travelTimesStatus)
    }, [travelTimesStatus])

    const explainerMessage = () => (
        !storage.getUserGeolocation() && showMessage &&
            <div className="explainer">
                <span
                    className="explainerIcons"
                    aria-hidden={true}
                >
                    <icons.Walk/>
                    <icons.Tram/>
                    <icons.Car/>
                </span>
                Want to see estimated travel times for the services below?
            </div>
    )

    const renderGeoLocateButton = () => (
        <GeolocationButton
            onStatusChange={(status) => {
                if (status.type === "COMPLETE") {
                    storage.setUserGeolocation(status.location);
                    loadTravelTimes()
                } else if (status.type === "NOT_STARTED") {
                    storage.clearUserGeolocation();
                    clearTravelTimes()
                }
            }}
            locationValue={storage.getUserGeolocation() || undefined}
            showLocationInSuccessMessage={true}
            successMessageSuffix={showMessage ?
                "Travel times added below."
                : null
            }
            showClearButton={true}
        />
    )

    return (
        <div className="GeolocationButtonForTravelTimes">
            {explainerMessage()}
            {renderGeoLocateButton()}
        </div>
    )
}

export default GeolocationButtonForTravelTimes
