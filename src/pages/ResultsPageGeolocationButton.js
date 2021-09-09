/* @flow */

import type {Element as ReactElement} from "react"
import React from "react";
import storage from "../storage";
import GeolocationButton from "../components/GeolocationButton";
import icons from "../icons";

type Props = {
    onGeoLocationSuccess: () => void,
    onfetchNewLocation: () => void,
    fetchedLocation: boolean,
    showMessage?: boolean,
}

/**
 * Renders the "Get your current location" catch on the results page,
 * to allow the user to set their location if they want travel times
 * @return {JSX.Element} - Returns the travel times catch component
 */
function ResultsPageGeolocationButton(
    {
        onGeoLocationSuccess,
        onfetchNewLocation,
        fetchedLocation = false,
        showMessage = true,
    }: Props): ReactElement<"div"> {
    return (
        <div className="ResultsPageGeoLocationButton">
            {!storage.getCoordinates() && showMessage &&
            <div className="explainer">
                <span className="explainerIcons">
                    <icons.Walk/>
                    <icons.Tram/>
                    <icons.Car/>
                </span>
                Want to see estimated travel times for the services below?
            </div>
            }
            <GeolocationButton
                onSuccess={onGeoLocationSuccess}
                finishedState={!!storage.getCoordinates()}
                travelTimesCatch={true}
                showMessage={showMessage}
                restartSearch={
                    !fetchedLocation
                }
                undoButton={storage.getCoordinates() &&
                <button
                    className="undo"
                    onClick={() => {
                        storage.removeItem("coordinates")
                        onfetchNewLocation()
                    }}
                >
                    Clear
                </button>
                }
            />
        </div>
    )
}

export default ResultsPageGeolocationButton
