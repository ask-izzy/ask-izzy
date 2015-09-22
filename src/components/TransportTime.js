/* @flow */

import React from "react";
import { titleize } from "underscore.string";

import fixtures from "../../fixtures/services";
import icons from "../icons";

class TransportTime extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        object: React.PropTypes.object.isRequired,
    };

    // flow:disable not supported yet
    static sampleProps = {default: {object: fixtures.ixa}};

    render(): ReactElement {
        var {
            object,
        } = this.props;

        if (object.location.point) {
            return (
                <div className="TransportTime">
                    <icons.Walk className="ColoredIcon brand-text-dark" />
                    <span className="time">? mins</span>&nbsp;
                    <span className="location">
                        {titleize(this.props.object.location.suburb)}
                    </span>
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
