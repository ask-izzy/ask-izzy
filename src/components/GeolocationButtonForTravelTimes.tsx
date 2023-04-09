import React, {useEffect} from "react";

import storage from "@/src/storage.js";
import GeolocationButton from "@/src/components/GeolocationButton.js";
import Walk from "@/src/icons/Walk.js"
import Tram from "@/src/icons/Tram.js"
import Car from "@/src/icons/Car.js"
import useTravelTimesUpdater from "@/src/hooks/useTravelTimesUpdater.js"
import Service from "@/src/iss/Service.js"


type Props = {
    showMessage?: boolean,
    servicesToUpdateTravelTimes: Array<Service>,
    onTravelTimesStatusChange: (travelTimesStatus) => void,
}

/**
 * Renders the "Get your location" catch on the results page,
 * to allow the user to set their location if they want travel times
 * @return {JSX.Element} - Returns the travel times catch component
 */
function GeolocationButtonForTravelTimes({
    servicesToUpdateTravelTimes,
    showMessage = true,
    onTravelTimesStatusChange,
}: Props) {

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
                    <Walk/>
                    <Tram/>
                    <Car/>
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
