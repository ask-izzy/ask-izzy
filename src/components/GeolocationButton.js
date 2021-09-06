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

const FinishedGeolocation = () => (
    <ListItem
        className="taller LocationButton"
        primaryText="Found your location"
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
    restartSearch: boolean
}

function GeolocationButton(
    {
        onSuccess,
        restartSearch,
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


        gtm.emit({
            event: "Geolocation Requested",
            eventCat: "Button Clicked",
            eventAction: "Geolocation Request",
            eventLabel: location.pathname,
            sendDirectlyToGA: true,
        });

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

    let geoLocationElm = (
        <NotStartedGeolocation
            onClick={onGeolocationClick}
        />
    )

    if (geolocation === "RUNNING") {
        geoLocationElm = <RunningGeolocation />;
    } else if (geolocation === "COMPLETE") {
        geoLocationElm = <FinishedGeolocation />;
    } else if (error) {
        geoLocationElm = <FailedGeolocation error={error}/>;
    }

    return (
        <p>
            {geoLocationElm}
            <em className="explainer">
                <span className="explainerIcons">
                    <icons.Walk/>
                    <icons.Tram/>
                    <icons.Car/>
                </span>
                Set your current location to see estimated travel times.
            </em>
        </p>
    )

}

export default GeolocationButton;
