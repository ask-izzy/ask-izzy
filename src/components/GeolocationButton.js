/* @flow */

import type {Node as ReactNode} from "React";
import React, {useState, useEffect} from "react";
import getPosition, {guessSuburb} from "../geolocation";
import icons from "../icons";
import * as gtm from "../google-tag-manager";
import type {Geolocation} from "../storage";
import Button from "./base/Button";

export type GeolocationStatus = {|
    type: "COMPLETE",
    location: Geolocation
|} | {|
    type: "FAILED",
    error: Error
|} | {|
    type: "NOT_STARTED" | "RUNNING"
|}

type GeolocationButtonProps = {|
    onStatusChange?: (GeolocationStatus) => void,
    locationValue?: Geolocation,
    showLocationInSuccessMessage?: boolean,
    successMessageSuffix?: ?string,
    showClearButton?: boolean
|}

function GeolocationButton({
    onStatusChange,
    locationValue,
    showLocationInSuccessMessage = false,
    successMessageSuffix,
    showClearButton = false,
}: GeolocationButtonProps): ReactNode {
    const [status, directSetStatus] =
        useState<GeolocationStatus>({type: "NOT_STARTED"})
    function setStatus(newStatus: GeolocationStatus) {
        directSetStatus(newStatus)
        onStatusChange?.(newStatus)
    }

    // Check for stored location after mount so as not to cause a
    // hydration mismatch
    useEffect(() => {
        if (locationValue && status.type !== "COMPLETE") {
            setStatus({
                type: "COMPLETE",
                location: locationValue,
            })
        } else if (!locationValue && status.type === "COMPLETE") {
            setStatus({
                type: "NOT_STARTED",
            })
        }
    }, [locationValue])

    // Several aria attributes require the use of an id to reference elements
    // but there can't be multiple elements on a page using the same id. So
    // in case this component is used in multiple location on a page we generate
    // a unique id to use for each instance.
    let [uniqueMessageElementID] = useState<string>(
        "statusMessage_" + Math.random()
    )

    async function getUsersLocation(): Promise<Geolocation> {
        const gpsLocation = await getPosition();
        const name = await guessSuburb(gpsLocation);
        const location = {
            name,
            latitude: gpsLocation.coords.latitude,
            longitude: gpsLocation.coords.longitude,
        }

        return location;
    }

    async function onGeolocationClick(): Promise<void> {
        if (status.type !== "NOT_STARTED") {
            return;
        }

        setStatus({type: "RUNNING"})

        let location: Geolocation

        try {
            location = await getUsersLocation()
        } catch (error) {
            const newGeolocationStatus = {
                type: "FAILED",
                error,
            }
            setStatus(newGeolocationStatus)
            console.error(error);
            return
        }

        const newGeolocationStatus = {
            type: "COMPLETE",
            location,
        }
        setStatus(newGeolocationStatus)
        gtm.emit({
            event: "Action Triggered - Geolocate",
            eventCat: "Action Triggered",
            eventAction: "Find my location",
            eventLabel: null,
            sendDirectlyToGA: true,
        })
    }

    const renderClearButton = () => (
        <Button
            className="undo"
            onClick={() => {
                const newGeolocationStatus = {type: "NOT_STARTED"}
                setStatus(newGeolocationStatus)
            }}
        >
            Clear
        </Button>
    )

    const Container = (props) => {
        if (status.type === "NOT_STARTED") {
            return (
                <Button
                    {...props}
                    className="LocationButton"
                    aria-controls={uniqueMessageElementID}
                    onClick={onGeolocationClick}
                />
            )
        } else {
            return (
                <div {...props} />
            )
        }
    }

    function renderLabel() {
        switch (status.type) {
        case "NOT_STARTED":
            return <>
                    <icons.Location/>
                    <span className="primary">
                        Get your current location
                    </span>
                </>
        case "RUNNING":
            return <>
                    <icons.Loading />
                    <div className="multiLine">
                        <span className="primary">
                            Locating you...
                        </span>
                        <span className="secondary">
                            Please permit us to use your GPS
                        </span>
                    </div>
                </>
        case "COMPLETE":
            return <>
                    <icons.Tick />
                    <span className="primary">
                        Found your location
                        {showLocationInSuccessMessage && status.location &&
                            ` (in ${status.location.name})`
                        }
                        {successMessageSuffix && ` – ${successMessageSuffix}`}
                        {showClearButton && renderClearButton()}
                    </span>
                </>;
        case "FAILED":
            return <>
                    <icons.Cross />
                    <div className="multiLine">
                        <span className="primary">
                            Unable to get your location
                        </span>
                        <span className="secondary">
                            {status.error?.message}
                        </span>
                    </div>
                </>
        default:
            return null
        }
    }

    return (
        <div className="GeoLocationButton">
            <Container>
                <div
                    className="label"
                    id={uniqueMessageElementID}
                >
                    {renderLabel()}
                </div>
            </Container>
        </div>
    )
}

export default GeolocationButton;
