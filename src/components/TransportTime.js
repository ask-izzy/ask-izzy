/* @flow */

import React from "react";
import { titleize } from "underscore.string";

import fixtures from "../../fixtures/services";
import icons from "../icons";

class TransportTime extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        object: React.PropTypes.object.isRequired,
        linkDirections: React.PropTypes.Boolean,
    };

    // flow:disable not supported yet
    static defaultProps = {
        linkDirections: true,
    };

    // flow:disable not supported yet
    static sampleProps = {default: {
        object: fixtures.ixa,
        linkDirections: false,
    }};

    render(): ReactElement {

        var object = this.props.object;

        /* NB We use CSS to suppress location in ServicePane */
        if (!object.isConfidential) {

            var point = encodeURIComponent(
                `${this.props.object.location.point.lat},
                ${this.props.object.location.point.lon}`);
            var url = `https://maps.google.com/?saddr=Current+Location&daddr=${point}`;

            return (
                <div className="TransportTime">
                    <icons.Walk className="ColoredIcon brand-text-dark" />
                    <span className="time">? mins</span>&nbsp;
                    <span className="location">
                        {titleize(this.props.object.location.suburb)}
                    </span>
                    {this.props.linkDirections ?
                        <div className="GetDirectionsLink">
                            <a href={url}>Get directions</a>
                        </div>
                    : ""}
                </div>
            );
        } else {
            /* This is a confidential location, we can't show any
             * transport time*/
            return (
                <div className="TransportTime">
                    <icons.Phone className="ColoredIcon brand-text-dark" />
                    <span className="time">Confidential location</span>&nbsp;
                    <span className="location">
                        {titleize(this.props.object.location.suburb)}
                    </span>
                </div>
            );
        }
    }
}

export default TransportTime;
