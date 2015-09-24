/* @flow */

import React from "react";
import { titleize } from "underscore.string";

import fixtures from "../../fixtures/services";
import icons from "../icons";

class TransportTime extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        point: React.PropTypes.object,
        suburb: React.PropTypes.string.isRequired,
        compact: React.PropTypes.boolean,
    };

    // flow:disable not supported yet
    static sampleProps = {default: fixtures.ixa.location};

    // flow:disable not supported yet
    get compactClass(): string {
        return this.props.compact ? "compact" : "";
    }

    renderConfidential(): ReactElement {
        /* This is a confidential location, we can't show any
         * transport time*/
        return (
            <div
                className={`TransportTime ${this.compactClass}`}
            >
                <icons.Phone className="ColoredIcon brand-text-dark" />
                <span className="time">Confidential location</span>&nbsp;
                <span className="location">
                    {titleize(this.props.suburb)}
                </span>
            </div>
        );
    }

    renderDirections(): ReactElement {
        if (!this.props.compact) {
            return (
                <div className="getDirections">
                    Get Directions
                </div>
            );
        }
        return <span />;
    }

    renderPublic(): ReactElement {
        return (
            <div
                className={`TransportTime ${this.compactClass}`}
            >
                <icons.Walk className="ColoredIcon" />
                <span className="time">? mins</span>&nbsp;
                <span className="location">
                    {titleize(this.props.suburb)}
                </span>
                {this.renderDirections()}
            </div>
        );
    }

    render(): ReactElement {
        if (this.props.point) {
            return this.renderPublic()
        } else {
            return this.renderConfidential()
        }
    }
}

export default TransportTime;
