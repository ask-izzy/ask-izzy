/* @flow */

import type {Node as ReactNode} from "React";
import React, {useEffect, useState} from "react";
import ButtonListItem from "./ButtonListItem";
import ListItem from "./ListItem";
import Geolocation, {guessSuburb} from "../geolocation";
import icons from "../icons";
import * as gtm from "../google-tag-manager";

type GeoLocationState = "NOT_STARTED"|"RUNNING"|"COMPLETE"|"FAILED";

type NotStartedGeolocationProps = {
    onClick: () => void
}

const NotStartedGeolocation = ({onClick}: NotStartedGeolocationProps) => (
    <ButtonListItem
        className="taller LocationButton"
        onClick={onClick}
        aria-label="Set your current location to get
         estimated travel times."
        primaryText={
            <span className="link-color link-text">
                Get your current location
            </span>
        }
        leftIcon={
            <icons.Location
                className="ColoredIcon icon-fg-color big"
            />
        }
        analyticsEvent={{
            event: "Action Triggered - Geolocate",
            eventAction: "Find my location",
            eventLabel: null,
        }}
    />
);

const RunningGeolocation = () => (
    <ListItem
        className="LocationButton"
        primaryText="Locating you..."
        secondaryText="Please permit us to use your GPS"
        leftIcon={
            <icons.Loading className="big" />
        }
    />
);

type FinishedGeolocationProps = {
    travelTimesCatch: boolean,
}

const FinishedGeolocation = ({travelTimesCatch}: FinishedGeolocationProps) => (
    <ListItem
        className="taller LocationButton"
        primaryText={`Found your location ${
            travelTimesCatch ? "– Travel times added below." : ""}`}
        leftIcon={<icons.Tick className="big" />}
    />
);

type FailedGeolocationProps = {
    error: string
}

const FailedGeolocation = ({error}: FailedGeolocationProps) => (
    <ListItem
        className="LocationButton"
        primaryText="Unable to get your location"
        secondaryText={`Please enter your location below
            (${error})`}
        leftIcon={<icons.Cross className="big" />}
    />
)

type GeolocationButtonProps = {
    onSuccess: (result: { name: string, coords: Coordinates }) => void,
    restartSearch: boolean,
    travelTimesCatch?: boolean
}

function GeolocationButton(
    {
        onSuccess,
        restartSearch,
        travelTimesCatch = false,
    } :GeolocationButtonProps
): ReactNode {

    const [geolocation, setGeolocation] = useState<GeoLocationState>(
        "NOT_STARTED"
    )
    const [error, setErrorMessage] = useState<?string>(null)

    // Reset the geoLocation state when
    // clearing the text box
    useEffect(() => {
        restartSearch && setGeolocation("NOT_STARTED")
        // Storage.removeItem("coordinates")
    }, [restartSearch])


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

    if (geolocation === "RUNNING") {
        return <RunningGeolocation />;
    } else if (geolocation === "COMPLETE") {
        return <FinishedGeolocation travelTimesCatch={travelTimesCatch} />;
    } else if (error) {
        return <FailedGeolocation error={error}/>;
    } else {
        return (
            <NotStartedGeolocation
                onClick={onGeolocationClick}
            />
        );
    }

}

export default GeolocationButton;
