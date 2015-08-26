/* @flow */

import moment from "moment";
import mui from "material-ui";
import React from "react";
import _ from "underscore";

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
        object: React.PropTypes.object.isRequired,
    };

    // flow:disable not supported yet
    static sampleProps = {object: fixtures.ixa};

    render(): React.Element {
        var {
            object,
        } = this.props;

        var todayOpen = _.findWhere(object.opening_hours,
                                    {day: moment().format('dddd')}
                                   ) || {};

        var nextOpen = _.findWhere(object.opening_hours,
                                   {day: moment().add(1, 'd').format('dddd')}
                                  ) || {};

        if (object.now_open.now_open) {
            return (
                <div className="OpeningTimes">
                    <icons.Clock className="ColoredIcon brand-text-dark" />
                    <span className="open">Open now</span>&nbsp;
                    <span className="until">
                        until {formatTime(todayOpen.close)}
                    </span>
                </div>
            );
        } else {
            return (
                <div className="OpeningTimes">
                    <icons.Clock className="ColoredIcon brand-text-dark" />
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
