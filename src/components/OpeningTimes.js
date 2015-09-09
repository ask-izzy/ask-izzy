/* @flow */

import moment from "moment";
import mui from "material-ui";
import React from "react";
import _ from "underscore";

import fixtures from "../../fixtures/services";
import ScreenReader from "./ScreenReader";
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
    static sampleProps = {default: {object: fixtures.ixa}};

    findOpeningHours(day = moment()): Object {
        return _.findWhere(this.props.object.opening_hours,
                    {day: day.format('dddd')}
                   ) || {};
    }

    render(): React.Element {
        var object = this.props.object;

        var when;
        var todayOpen = this.findOpeningHours();

        for (var day = 1; day <= 7; day++) {
            /* look for the next day the service is open */
            var nextOpen = this.findOpeningHours(moment().add(day, 'd'));

            if (!_.isEmpty(nextOpen)) {
                if (day == 1) {
                    when = 'tomorrow';
                } else if (day == 7) {
                    when = `next ${nextOpen.day}`;
                } else {
                    when = nextOpen.day;
                }

                break;
            }
        }

        if (object.now_open.now_open) {
            return (
                <div className="OpeningTimes">
                    <ScreenReader>
                        <h4>Opening times</h4>
                    </ScreenReader>
                    <icons.Clock className="ColoredIcon brand-text-dark" />
                    <span className="open">Open now</span>
                    {' '}
                    {
                        !_.isEmpty(todayOpen) ?
                            <span className="until">
                                until {formatTime(todayOpen.close)}
                            </span>
                        :
                            ''
                    }
                </div>
            );
        } else {
            return (
                <div className="OpeningTimes">
                    <ScreenReader>
                        <h4>Opening times</h4>
                    </ScreenReader>
                    <icons.Clock className="ColoredIcon brand-text-dark" />
                    <span className="closed">Closed</span>
                    {' '}
                    {
                        !_.isEmpty(nextOpen) ?
                            <span className="until">
                                until
                                {' '}
                                {when}
                                {' '}
                                {formatTime(nextOpen.open)}
                            </span>
                        :
                            ''
                    }
                </div>
            );
        }

    }
}

export default OpeningTimes;
