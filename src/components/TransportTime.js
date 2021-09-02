/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import { titleize } from "underscore.string";

import icons from "../icons";
import Location from "../iss/Location";
import Spacer from "./Spacer";

class TransportTime extends React.Component<{
    location: Location,
    withSpacer?: Boolean,
}, void> {
    static defaultProps: any = {
        withSpacer: false,
    };

    render(): ReactNode | null {
        if (!this.props.location.isConfidential()) {
            return this.renderPublic()
        } else {
            return null;
        }
    }

    renderPublic(): ReactNode {
        const {travelTime} = this.props.location;

        if (!travelTime) {
            return <div />;
        }

        return (
            <div>
                {this.props.withSpacer && <Spacer />}
                <div className={"TransportTime"}>
                    {this.renderTravelTimes(travelTime)}
                </div>
            </div>
        );
    }

    getTravelText(travel: Object): string {
        return travel &&
        travel.duration &&
        travel.duration.text
    }

    formatAriaLabel(travel: Object): string {
        const travelText = this.getTravelText(travel)
        switch (travel.mode) {
        case "TRANSIT":
            return `${travelText} travel by public transport.`;
        case "DRIVING":
            return `${travelText} drive by car.`;
        default:
            return `${travelText} walk.`;
        }
    }

    renderTravelTimes(travelTimes: Object): any {
        return travelTimes.map((travel, key) => {
            let icon = "";
            let method = "";

            let arrivalTime = new Date();

            arrivalTime.setSeconds(
                arrivalTime.getSeconds() + travel.duration.value
            );

            if (travel.mode === "TRANSIT") {
                icon = (
                    <icons.Tram
                        className="ColoredIcon"
                    />
                );
                method = (" transport");
            } else if (travel.mode === "DRIVING") {
                icon = (
                    <icons.Car
                        className="ColoredIcon"
                    />
                );
                method = (" drive");
            } else {
                icon = (
                    <icons.Walk
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
                    aria-label={this.formatAriaLabel(travel)}
                >
                    {icon}
                    <span>
                        <time dateTime={arrivalTime.toISOString()}>
                            {this.getTravelText(travel)}
                        </time>
                        {method}
                    </span>
                </div>
            );

        });

    }

    renderSuburb(): ReactNode {
        return (
            <span className="location">
                {titleize(this.props.location.suburb)}
            </span>
        );
    }
}

export default TransportTime;
