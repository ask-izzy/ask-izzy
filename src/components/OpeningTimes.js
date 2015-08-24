/* @flow */

import moment from "moment";
import mui from "material-ui";
import React, { PropTypes } from "react";

import fixtures from "../../fixtures/services";
import colors from "../constants/theme";
var palette = colors.getPalette();

import icons from '../icons';

function formatTime(in_): string {
    return moment(in_, 'HH:mm:ss').format('h:mm A');
}

class OpeningTimes extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        object: PropTypes.object.isRequired,
    };

    // flow:disable not supported yet
    static sampleProps = {object: fixtures.ixa};

    render(): React.Element {
        var {
            object,
        } = this.props;

        var todayOpen = object.opening_hours[
            moment().day()
        ] || {};

        var nextOpen = object.opening_hours[
            (moment().day() + 1) % object.opening_hours.length
        ] || {};

        if (object.now_open.now_open) {
            return (
                <div className="OpeningTimes">
                    <icons.Clock className="ColoredIcon brand-bg-dark" />
                    <span className="open">Open now</span>&nbsp;
                    <span className="until">
                        until {formatTime(todayOpen.close)}
                    </span>
                </div>
            );
        } else {
            return (
                <div className="OpeningTimes">
                    <icons.Clock className="ColoredIcon brand-bg-dark" />
                    <span className="closed">Closed</span>&nbsp;
                    {
                        nextOpen ?
                            <span className="until">
                                until {nextOpen.day}&nbsp;
                                {formatTime(nextOpen.open)}
                            </span> :
                            <span></span>
                    }
                </div>
            );
        }

    }
}

export default OpeningTimes;
