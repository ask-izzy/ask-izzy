/* @flow */

import React from "react";
import { titleize } from "underscore.string";

import fixtures from "../../fixtures/services";
import icons from "../icons";
import Location from "../iss/Location";
import storage from "../storage";
import Maps from "../maps";

class TransportTime extends React.Component {
    static propTypes = {
        compact: React.PropTypes.bool,
        location: React.PropTypes.object.isRequired,
    };

    static sampleProps = {
        compact: {
            location: new Location(fixtures.ixa.location),
            compact: true,
        },
        expanded: {
            location: new Location(fixtures.ixa.location),
            compact: false,
        },
    };

    static defaultProps = {
        compact: false,
    };

    constructor() {
        super();
        this.state = {};
    }

    // flow:disable not supported yet
    get compactClass(): string {
        return this.props.compact ? "compact" : "";
    }

    async loadTime(): Promise<void> {
        const maps = await Maps();
        const destPoint = this.props.location.point;
        const coords = storage.getJSON("coordinates");
        let location = storage.getItem("location");

        if (coords && coords.latitude && coords.longitude) {
            location = `${coords.latitude},${coords.longitude}`;
        }
        // FIXME: check google.maps.DirectionsTravelMode.TRANSIT
        // once we expand beyond VIC (or transit is implemented in VIC).

        const options = {
            origin: `${location}`,
            destination: `${destPoint.lat},${destPoint.lon}`,
            travelMode: maps.api.DirectionsTravelMode.WALKING,
            unitSystem: maps.api.UnitSystem.METRIC,
            language: "en-AU",
        };

        this.setState({time: await maps.travelTime(options)});
    }

    render(): ReactElement {
        this.loadTime();

        if (this.props.location.isConfidential()) {
            return this.renderConfidential()
        } else {
            return this.renderPublic()
        }
    }

    renderConfidential(): ReactElement {
        /* This is a confidential location, we can't show any
         * transport time*/
        return (
            <div
                className={`TransportTime ${this.compactClass}`}
            >
                <icons.Phone className="ColoredIcon brand-text-dark" />
                <span className="travel-time">
                    Confidential location
                </span>&nbsp;
                {this.renderSuburb()}
            </div>
        );
    }

    renderPublic(): ReactElement {
        return (
            <div
                className={`TransportTime ${this.compactClass}`}
            >
                <icons.Walk className="ColoredIcon" />
                <span className="travel-time">
                    {this.state.time}
                </span>&nbsp;
                {this.renderSuburb()}
                {this.renderDirections()}
            </div>
        );
    }

    renderDirections(): ReactElement {
        if (!this.props.compact) {
            return (
                <div className="getDirections">
                    Get directions
                </div>
            );
        }
        return <span />;
    }

    renderSuburb(): ReactElement {
        return (
            <span className="location">
                {titleize(this.props.location.suburb)}
            </span>
        );
    }
}

export default TransportTime;
