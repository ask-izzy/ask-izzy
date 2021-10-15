/* @flow */

import type {Element as ReactElement} from "react"
import React, {useEffect, useState} from "react";
import Storage from "../storage";
import GeolocationButton from "./GeolocationButton";
import icons from "../icons";
import {MobileDetect} from "../effects/MobileDetect";
import Button from "./base/Button";

type Props = {
    showMessage?: boolean,
}

/**
 * Renders the "Get your current location" catch on the results page,
 * to allow the user to set their location if they want travel times
 * @return {JSX.Element} - Returns the travel times catch component
 */
function GeolocationButtonForTravelTimes(
    {
        showMessage = true,
    }: Props): ReactElement<"div"> {

    const [collapsed, setCollapsed] = useState(true);
    const [foundLocation, setFoundLocation] = useState(false);

    const isMobile = MobileDetect(556)
    const isSmallMobileDevice = MobileDetect(374)

    useEffect(() => {
        Storage.getCoordinates() && setFoundLocation(true)
    }, [Storage.getCoordinates()])

    const explainerMessage = () => (
        !Storage.getCoordinates() && showMessage &&
            <div className={`explainer ${collapsed ? "collapsed" : ""}`}>
                {(!isSmallMobileDevice || !collapsed) &&
                <span className="explainerIcons">
                    <icons.Walk/>
                    <icons.Tram/>
                    <icons.Car/>
                </span>}
                {collapsed && (isMobile || isSmallMobileDevice) ?
                    "See estimated travel times?"
                    // eslint-disable-next-line max-len
                    : "Want to see estimated travel times for the services below?"}
            </div>
    )

    const renderGeoLocateButton = () => (
        <GeolocationButton
            onSuccess={(params: {coords: Coordinates, name: string}) => {
                Storage.setCoordinates(params.coords, params.name);
                setFoundLocation(true)
            }}
            finishedState={!!Storage.getCoordinates()}
            travelTimesCatch={true}
            showMessage={showMessage}
            restartSearch={
                foundLocation
            }
            undoButton={foundLocation &&
            <button
                className="undo"
                onClick={() => {
                    Storage.removeItem("coordinates")
                    setFoundLocation(false)
                }}
            >
                Clear
            </button>
            }
        />
    )

    if (isMobile && !Storage.getCoordinates() && showMessage) {
        return <div className="GeolocationButtonForTravelTimes">
            <div className="collapserContainer">
                <Button
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={
                        `${collapsed ? "expand" : "collapse"} ` +
                         `get travel times section`}
                >
                    <div className={`plus ${!collapsed ? "close" : ""}`}>
                        <icons.Chevron/>
                    </div>
                </Button>
                {explainerMessage()}
            </div>
            {!collapsed && renderGeoLocateButton()}
        </div>
    }

    return (
        <div className="GeolocationButtonForTravelTimes">
            {explainerMessage()}
            {renderGeoLocateButton()}
        </div>
    )
}

export default GeolocationButtonForTravelTimes
