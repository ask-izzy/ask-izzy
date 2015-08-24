/* @flow */

import moment from "moment";
import mui from "material-ui";
import React, { PropTypes } from "react";

import colors from "../constants/theme";
var palette = colors.getPalette();

import icons from '../icons';

class OpeningTimes extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        object: PropTypes.object.isRequired,
    };

    render(): React.Element {
        var {
            object,
        } = this.props;

        return (
            <div className="TransportTime">
                <icons.Walk className="ColoredIcon brand-bg-dark" />
                <span className="time">FIXME</span>&nbsp;
                <span className="location">transport time</span>
            </div>
        );
    }
}

export default OpeningTimes;
