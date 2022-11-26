import React, {ReactElement} from "react";
import classnames from "classnames";

import Tram from "@/src/icons/Tram";
import Car from "@/src/icons/Car";
import Walk from "@/src/icons/Walk";
import Spacer from "@/src/components/Spacer";
import AddressLocation from "@/src/iss/AddressLocation";
import type {travelTime} from "@/src/iss/general"

type Props = {
    location: AddressLocation,
    travelTimes: Array<travelTime>,
    withSpacer?: boolean,
}

function TransportTime({
    location,
    withSpacer,
    travelTimes,
}: Props) {

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
                        {withSpacer},
                    )}
                >
                    {renderTravelTimes()}
                </div>
            </div>
        );
    }

    const getTravelText = (travel: Record<string, unknown>): string => {
        return travel &&
        travel.duration &&
        (travel.duration as any).text
    }

    const formatAriaLabel = (travel: Record<string, unknown>): string => {
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
            let icon: any = "";
            let method = "";

            const arrivalTime = new Date();

            arrivalTime.setSeconds(
                arrivalTime.getSeconds() + travel.duration.value,
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
