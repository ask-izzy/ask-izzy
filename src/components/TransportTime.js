/* @flow */

import React from "react";
import classnames from "classnames";
import { titleize } from "underscore.string";

import fixtures from "../../fixtures/services";
import icons from "../icons";
import Location from "../iss/Location";

class TransportTime extends React.Component {
    static propTypes = {
        compact: React.PropTypes.bool,
        location: React.PropTypes.object.isRequired,
    };

    static sampleProps = {
        compact: {
            location: new Location(fixtures.ixa.location, {
                mode: "WALK",
                duration: {text: "15 minutes"},
            }),
            compact: true,
        },
        expanded: {
            location: new Location(fixtures.ixa.location, {
                mode: "TRANSIT",
                duration: {text: "15 minutes"},
            }),
            compact: false,
        },
    };

    static defaultProps = {
        compact: false,
    };

    constructor() {
        super();
        this.state = {time: {}};
    }

    render(): ReactElement {
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
                className={classnames(
                    "TransportTime",
                    {compact: this.props.compact}
                )}
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
        const {travelTime} = this.props.location;

        return (
            <div
                className={classnames(
                    "TransportTime",
                    {compact: this.props.compact}
                )}
            >
                {travelTime.mode === "TRANSIT" ?
                <icons.Tram className="ColoredIcon" />
                : <icons.Walk className="ColoredIcon" />
                }
                <span className="travel-time">
                    {
                        travelTime &&
                        travelTime.duration &&
                        travelTime.duration.text
                    }
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
