/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";
import classnames from "classnames";

import Tram from "../icons/tram.svg";
import Car from "../icons/car.svg";
import Walk from "../icons/walk.svg";
import ExternalLink from "../icons/external-link.svg";
import Spacer from "./Spacer";
import AddressLocation from "../iss/AddressLocation";
import type {travelTime} from "../iss/general"

type Props = {
    location: AddressLocation,
    travelTimes: Array<travelTime>,
    withSpacer?: boolean,
}

function TransportTime({
    location,
    withSpacer,
    travelTimes,
}: Props): ReactNode {

    const renderPublic = (): ReactElement<"div"> => {

        if (!location) {
            return <div />;
        }

        return (
            <div>
                {withSpacer && <Spacer />}
                <div
                    className={classnames(
                        "TransportTime",
                        {withSpacer}
                    )}
                >
                    {renderTravelTimes()}
                </div>
            </div>
        );
    }

    const getTravelText = (travel: Object): string => {
        return travel &&
        travel.duration &&
        travel.duration.text
    }

    const formatAriaLabel = (travel: Object): string => {
        const travelText = getTravelText(travel)
        switch (travel.mode) {
        case "TRANSIT":
            return `${travelText} travel by public transport.`;
        case "DRIVING":
            return `${travelText} drive by car.`;
        default:
            return `${travelText} walk.`;
        }
    }

    const renderTravelTimes = (): any => {
        return travelTimes.map((travel, key) => {
            let icon = "";
            let method = "";

            let arrivalTime = new Date();

            arrivalTime.setSeconds(
                arrivalTime.getSeconds() + travel.duration.value
            );

            if (travel.mode === "TRANSIT") {
                icon = (
                    <Tram
                        className="ColoredIcon"
                    />
                );
                method = (" transport");
            } else if (travel.mode === "DRIVING") {
                icon = (
                    <Car
                        className="ColoredIcon"
                    />
                );
                method = (" drive");
            } else {
                icon = (
                    <Walk
                        className="ColoredIcon"
                    />
                );
                method = (" walk");
            }

            return (
                <div
                    className={
                        "travel-time travel-mode-" +
                        travel.mode.toLocaleLowerCase()
                    }
                    key={key}
                    aria-label={formatAriaLabel(travel)}
                >
                    {icon}
                    <span>
                        <time dateTime={arrivalTime.toISOString()}>
                            {getTravelText(travel)}
                        </time>
                        {method}
                    </span>
                </div>
            );

        });

    }

    if (!location.isConfidential()) {
        return renderPublic()
    }
    return null;

}

export default TransportTime;
