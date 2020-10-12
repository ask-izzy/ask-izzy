/* @flow */

import React from "react";
import classnames from "classnames";
import { titleize } from "underscore.string";

import fixtures from "../../fixtures/services";
import icons from "../icons";
import Location from "../iss/Location";
import * as gtm from "../google-tag-manager";
import Spacer from "./Spacer";

class TransportTime extends React.Component<{
    location: Location,
    compact?: Boolean,
}, void> {
    static defaultProps = {
        compact: false,
    };

    constructor() {
        super();
    }

    static sampleProps = {
        compact: {
            location: new Location(fixtures.ixa.location, [{
                mode: "WALK",
                duration: {text: "15 minutes", value: 1},
                distance: {text: "", value: 1},
                status: "",
            }]),
            compact: true,
        },
        expanded: {
            location: new Location(fixtures.ixa.location, [{
                mode: "TRANSIT",
                duration: {text: "15 minutes", value: 1},
                distance: {text: "", value: 1},
                status: "",
            }]),
            compact: false,
        },
    };

    render() {
        if (!this.props.location.isConfidential()) {
            return this.renderPublic()
        } else {
            return null;
        }
    }

    renderPublic() {
        const {travelTime} = this.props.location;

        if (!travelTime) {
            return <div />;
        }

        return (
            <div>
                {this.renderDivider()}
                <div
                    className={classnames(
                        "TransportTime",
                        {compact: this.props.compact}
                    )}
                >
                    {this.renderTravelTimes(travelTime)}
                    {this.renderDirections()}
                </div>
            </div>
        );
    }

    renderTravelTimes(travelTimes: Object) {
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
                        aria-label="By public transport"
                    />
                );
                method = (" transport");
            } else if (travel.mode === "DRIVING") {
                icon = (
                    <icons.Car
                        className="ColoredIcon"
                        aria-label="By car"
                    />
                );
                method = (" drive");
            } else {
                icon = (
                    <icons.Walk
                        className="ColoredIcon"
                        aria-label="On foot"
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
                >
                    {icon}
                    <span>
                        <time dateTime={arrivalTime.toISOString()}>
                            {
                                travel &&
                            travel.duration &&
                            travel.duration.text
                            }
                        </time>
                        {method}
                    </span>
                </div>
            );

        });

    }

    renderDivider() {
        if (!this.props.compact) {
            return (
                <Spacer />
            );
        } else {
            return null;
        }
    }

    recordClick(): void {
        console.log("fafasd")
        const {location} = this.props;

        gtm.emit({
            event: "clickGetDirections",
            addressLine1: location.streetAddressLine1(),
            addressLine2: location.streetAddressLine2(),
        });

        gtm.emit({
            event: "Google Maps Link Clicked",
            eventCat: "External Link Clicked",
            eventAction: "Google Maps Directions",
            eventLabel: window.location.pathname,
            sendDirectlyToGA: true,
        }, "GTM-54BTPQM");
    }

    renderDirections() {
        if (!this.props.compact) {
            return (
                <div className="getDirections">
                    <span onClick={this.recordClick.bind(this)}>
                        Get directions in Google Maps
                    </span>
                    <span>
                        <icons.ExternalLink className="ExternalLinkIcon" />
                    </span>
                </div>
            );
        }
        return <span />;
    }

    renderSuburb() {
        return (
            <span className="location">
                {titleize(this.props.location.suburb)}
            </span>
        );
    }
}

export default TransportTime;
