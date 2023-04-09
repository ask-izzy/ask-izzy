import React, {useState, useEffect} from "react";
import getPosition, {guessSuburb} from "@/src/geolocation.js";
import Location from "@/src/icons/Location.js";
import Loading from "@/src/icons/Loading.js"
import Tick from "@/src/icons/Tick.js"
import Cross from "@/src/icons/Cross.js"
import * as gtm from "@/src/google-tag-manager.js";
import type {Geolocation} from "@/src/storage.js";
import Button from "@/src/components/base/Button.js";


export type GeolocationStatus = {
    type: "COMPLETE",
    location: Geolocation
} | {
    type: "FAILED",
    error: Error
} | {
    type: "NOT_STARTED" | "RUNNING"
}

type GeolocationButtonProps = {
    onStatusChange?: (GeolocationStatus) => void,
    locationValue?: Geolocation,
    showLocationInSuccessMessage?: boolean,
    successMessageSuffix?: string | null,
    showClearButton?: boolean,
    buttonClickCallback?: (clickRef: (event?: Event) => Promise<void>) => void,
}

function GeolocationButton({
    onStatusChange,
    locationValue,
    showLocationInSuccessMessage = false,
    successMessageSuffix,
    showClearButton = false,
    buttonClickCallback,
}: GeolocationButtonProps) {
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

    useEffect(() => {
        if (buttonClickCallback) {
            buttonClickCallback(onGeolocationClick)
        }
    })

    // Several aria attributes require the use of an id to reference elements
    // but there can't be multiple elements on a page using the same id. So
    // in case this component is used in multiple location on a page we generate
    // a unique id to use for each instance.
    const [uniqueMessageElementID] = useState<string>(
        "statusMessage_" + Math.random(),
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

    async function onGeolocationClick(event?: Event): Promise<void> {
        if (event) {
            event.stopPropagation()
        }

        if (status.type !== "NOT_STARTED") {
            return;
        }

        setStatus({type: "RUNNING"})

        let location: Geolocation

        try {
            location = await getUsersLocation()
        } catch (error) {
            const newGeolocationStatus: GeolocationStatus = {
                type: "FAILED",
                error,
            }
            setStatus(newGeolocationStatus)
            console.error(error);
            return
        }

        const newGeolocationStatus: GeolocationStatus = {
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
                const newGeolocationStatus: GeolocationStatus = {type: "NOT_STARTED"}
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
                <Location/>
                <span className="primary">
                    Get your location
                </span>
            </>
        case "RUNNING":
            return <>
                <Loading />
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
                <Tick />
                <span className="primary">
                    Found your location
                    {showLocationInSuccessMessage && status.location &&
                        ` (in ${status.location.name})`
                    }
                    {successMessageSuffix && ` – ${successMessageSuffix}`}
                    {showClearButton && renderClearButton()}
                </span>
            </>
        case "FAILED":
            return <>
                <Cross />
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
