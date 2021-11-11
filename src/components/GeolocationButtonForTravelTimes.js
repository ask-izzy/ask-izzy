/* @flow */

import type {Element as ReactElement} from "react"
import React, {useEffect, useState} from "react";
import storage from "../storage";
import GeolocationButton from "./GeolocationButton";
import icons from "../icons";
import {MobileDetect} from "../effects/MobileDetect";
import useTravelTimesUpdater from "../hooks/useTravelTimesUpdater"
import type {travelTimesStatus} from "../hooks/useTravelTimesUpdater";
import Button from "./base/Button";
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

    const [collapsed, setCollapsed] = useState(true);

    const {
        travelTimesStatus,
        loadTravelTimes,
        clearTravelTimes,
    } = useTravelTimesUpdater(servicesToUpdateTravelTimes)

    const isMobile = MobileDetect(556)
    const isSmallMobileDevice = MobileDetect(374)

    useEffect(() => {
        onTravelTimesStatusChange(travelTimesStatus)
    }, [travelTimesStatus])

    const explainerMessage = () => (
        !storage.getUserGeolocation() && showMessage &&
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

    if (isMobile && !storage.getUserGeolocation() && showMessage) {
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
