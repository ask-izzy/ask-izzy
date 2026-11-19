import type {ReactElement} from "react"
import React, {useEffect} from "react";
import storage from "../storage";
import GeolocationButton from "./GeolocationButton";
import icons from "../icons";
import useTravelTimesUpdater from "../hooks/useTravelTimesUpdater"
import type {travelTimesStatus} from "../hooks/useTravelTimesUpdater";
import Service from "../iss/Service"

type Props = {
    showMoreDetails?: boolean,
    servicesToUpdateTravelTimes: Array<Service>,
    onTravelTimesStatusChange: (arg0: travelTimesStatus) => void,
}

/**
 * Renders the "Get your location" catch on the results page,
 * to allow the user to set their location if they want travel times
 * @return {JSX.Element} - Returns the travel times catch component
 */
function GeolocationButtonForTravelTimes({
    servicesToUpdateTravelTimes,
    showMoreDetails = true,
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

    const showExplainer = showMoreDetails && !storage.getUserGeolocation()

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
            successMessageSuffix={showMoreDetails ?
                "Travel times added below."
                : null
            }
            showClearButton={true}
        />
    )

    return (
        <div className="GeolocationButtonForTravelTimes">
            {showMoreDetails && (
                <div
                    className="explainerIcons"
                    aria-hidden={true}
                >
                    <icons.Walk noSpanWrapper={true} />
                    <icons.Tram noSpanWrapper={true} />
                    <icons.Car noSpanWrapper={true} />
                </div>
            )}
            <div className="content">
                {showExplainer && (
                    <div className="explainer">
                        Want to see estimated travel times for the services below?
                    </div>
                )}
                {renderGeoLocateButton()}
            </div>
        </div>
    )
}

export default GeolocationButtonForTravelTimes
