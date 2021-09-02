/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";
import classnames from "classnames";
import { titleize } from "underscore.string";

import fixtures from "../../fixtures/services";
import icons from "../icons";
import Location from "../iss/Location";
import * as gtm from "../google-tag-manager";
import Spacer from "./Spacer";
import GoogleMapsLink from "./GoogleMapsLink";

class TransportTime extends React.Component<{
    location: Location,
    compact?: Boolean,
    // If this component is already wrapped in a <GoogleMapsLink /> then
    // including it again will create invalid HTML. We should probably
    // rethink the design such that this doesn't happen but for now this
    // works as an ugly workaround.
    withoutLink?: boolean,
}, void> {
    static defaultProps: any = {
        compact: false,
    };

    constructor() {
        super();
    }

    static sampleProps: any = {
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

    render(): null | ReactElement<"div"> {
        if (!this.props.location.isConfidential()) {
            return this.renderPublic()
        } else {
            return null;
        }
    }

    renderPublic(): ReactElement<"div"> {
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

    renderDivider(): null | ReactNode {
        if (!this.props.compact) {
            return (
                <Spacer />
            );
        } else {
            return null;
        }
    }

    recordClick(): void {
        gtm.emit({
            event: "Google Maps Link Clicked",
            eventCat: "External Link Clicked",
            eventAction: "Google Maps Directions",
            eventLabel: window.location.pathname,
            sendDirectlyToGA: true,
        });
    }

    renderDirections(): ReactElement<"span"> | ReactNode {
        if (!this.props.compact) {
            const linkText = (
                <span className="googleMapsLink">
                    Get directions in Google Maps
                    <icons.ExternalLink
                        className="ExternalLinkIcon"
                    />
                </span>
            )

            if (this.props.withoutLink) {
                return linkText
            } else {
                return (
                    <GoogleMapsLink
                        to={this.props.location}
                        className="getDirections"
                        onClick={this.recordClick.bind(this)}
                        hideSpacer={true}
                    >
                        {linkText}
                    </GoogleMapsLink>
                )
            }
        }
        return <span />;
    }

    renderSuburb(): ReactElement<"span"> {
        return (
            <span className="location">
                {titleize(this.props.location.suburb)}
            </span>
        );
    }
}

export default TransportTime;
