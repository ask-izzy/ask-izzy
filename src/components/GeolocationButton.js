/* @flow */

import type {Node as ReactNode} from "React";
import React, {useState} from "react";
import Geolocation, {guessSuburb} from "../geolocation";
import icons from "../icons";
import * as gtm from "../google-tag-manager";
import storage from "../storage";
import Button from "./base/Button";

type GeoLocationState = "NOT_STARTED"|"RUNNING"|"COMPLETE"|"FAILED";

type GeolocationButtonProps = {
    onSuccess: (result: { name: string, coords: Coordinates }) => void,
    onLocationCleared?: () => void,
    travelTimesCatch?: boolean,
    finishedState?: boolean,
    successMessage?: ?string,
    showClearButton?: boolean
}

function GeolocationButton({
    onSuccess,
    onLocationCleared,
    showClearButton = false,
    travelTimesCatch = false,
    finishedState = false,
    successMessage,
}: GeolocationButtonProps): ReactNode {

    const [geolocation, setGeolocation] = useState<GeoLocationState>(
        "NOT_STARTED"
    )
    const [error, setErrorMessage] = useState<?string>(null)

    const GEO_LOCATION_STATE_TEXT = {
        NOT_STARTED: {
            text: () => (
                <>
                    <icons.Location/>
                    <span
                        className="primary"
                        aria-live="geoLocate"
                    >
                        Get your current location
                    </span>
                </>
            ),
            "aria-label": "Set your current location to get " +
             "estimated travel times.",
            analyticsEvent: {
                event: "Action Triggered - Geolocate",
                eventAction: "Find my location",
                eventLabel: null,
            },
        },
        RUNNING: {
            "aria-label": "Fetching your location.",
            text: () => (
                <>
                    <icons.Loading />
                    <div
                        className="multiLine"
                        aria-live="geoLocate"
                    >
                        <span className="primary">
                            Locating you...
                        </span>
                        <span className="secondary">
                            Please permit us to use your GPS
                        </span>
                    </div>
                </>
            ),
        },
        COMPLETE: {
            "aria-label": "Found your location",
            text: () => (
                <>
                    <icons.Tick />
                    <span
                        className="primary"
                        aria-live="geoLocate"
                    >
                        Found your location
                    </span>
                </>
            ),
        },
        FAILED: {
            "aria-label": "Unable to get your location.",
            text: () => (
                <>
                    <icons.Cross />
                     <div
                         className="multiLine"
                         aria-live="geoLocate"
                     >
                         <span className="primary">
                            Unable to get your location
                         </span>
                         <span className="secondary">
                             {error}
                         </span>
                     </div>
                </>
            ),
        },
    }

    const locateMe = async(): Promise<Object> => {
        let location = await Geolocation();
        let name = await guessSuburb(location);

        return {name, coords: location.coords};
    }

    const onGeolocationClick = (): void => {
        if (geolocation !== "NOT_STARTED") {
            return;
        }

        setGeolocation("RUNNING")

        // If the Geo-locate button is clicked on the results page
        // send a specific event to GA
        if (travelTimesCatch) {
            gtm.emit({
                event: "Results page - Geolocation Requested",
                eventCat: "Button Clicked",
                eventAction: "Results page -Geolocation Request",
                eventLabel: location.pathname,
                sendDirectlyToGA: true,
            });
        } else {
            gtm.emit({
                event: "Geolocation Requested",
                eventCat: "Button Clicked",
                eventAction: "Geolocation Request",
                eventLabel: location.pathname,
                sendDirectlyToGA: true,
            });
        }

        locateMe()
            .then((params) => {
                setGeolocation("COMPLETE")
                gtm.emit({event: "geolocation-success"});

                onSuccess(params);
            })
            .catch(error => {
                gtm.emit({
                    event: "Geolocation Request Failed",
                    eventCat: "Error Occurred",
                    eventAction: "Geolocation",
                    eventLabel: location.pathname,
                    sendDirectlyToGA: true,
                });
                console.error(error);
                setGeolocation("FAILED")
                setErrorMessage(error.message)
            });
    }

    const renderClearButton = () => (
        <button
            className="undo"
            onClick={() => {
                storage.removeItem("coordinates")
                setGeolocation("NOT_STARTED")
                onLocationCleared?.()
            }}
        >
            Clear
        </button>

    )

    return (
        <div className="GeoLocationButton">
            {!finishedState ? (
                geolocation === "COMPLETE" ? (
                    <div className="complete">
                        <div className="buttonLabel">
                            {GEO_LOCATION_STATE_TEXT[geolocation].text()}
                        </div>
                    </div>
                )
                    : (
                        <Button
                            className="LocationButton"
                            aria-controls="geoLocate"
                            onClick={
                                geolocation === "NOT_STARTED" ?
                                    onGeolocationClick : () => null
                            }
                            aria-label={GEO_LOCATION_STATE_TEXT[
                                geolocation]?.["aria-label"] ||
                                "Fetch your location"
                            }
                        >
                            <div className="buttonLabel">
                                {GEO_LOCATION_STATE_TEXT[geolocation]
                                    .text()}
                            </div>
                        </Button>
                    )
            ) : (
                <>
                    <icons.Tick className="big" />
                    <span
                        className="primary"
                        aria-live="geoLocate"
                    >
                        {storage.getCoordinates() ?
                            <>
                                Found your location
                                (in {storage.getCoordinates()?.name})
                                {successMessage ? ` – ${successMessage}` : ""}
                                {storage.getCoordinates() && showClearButton &&
                                    renderClearButton()
                                }
                            </>
                            : "Can't find your location."
                        }
                    </span>
                </>
            )}
        </div>
    )


}

export default GeolocationButton;
