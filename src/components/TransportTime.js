/* @flow */

"use strict";

import moment from "moment";
import mui from "material-ui";
import React from "react";
import { titleize } from "underscore.string";

import colors from "../constants/theme";
import fixtures from "../../fixtures/services";

var palette = colors.getPalette();

import icons from '../icons';

class TransportTime extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        object: React.PropTypes.object.isRequired,
    };

    // flow:disable not supported yet
    static sampleProps = {default: {object: fixtures.ixa}};

    render(): React.Element {
        var {
            object,
        } = this.props;

        return (
            <div className="TransportTime">
                <icons.Walk className="ColoredIcon brand-text-dark" />
                <span className="time">? mins</span>&nbsp;
                <span className="location">
                    {titleize(this.props.object.location.suburb)}
                </span>
            </div>
        );
    }
}

export default TransportTime;
