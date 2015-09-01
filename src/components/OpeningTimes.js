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

        var when;
        var todayOpen = _.findWhere(object.opening_hours,
                                    {day: moment().format('dddd')}
                                   ) || {};

        for (var day = 1; day <= 7; day++) {
            /* look for the next day the service is open */
            var nextOpen = _.findWhere(object.opening_hours,
                                       {
                                           day: moment()
                                               .add(day, 'd')
                                               .format('dddd'),
                                       }
                                      ) || {};
            if (!_.isEmpty(nextOpen)) {
                if (day == 1) {
                    when = 'tomorrow';
                } else if (day <= 7) {
                    when = 'nextWeek';
                } else {
                    when = 'thisWeek';
                }

                break;
            }
        }

        if (object.now_open.now_open) {
            return (
                <div className="OpeningTimes">
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
                    <icons.Clock className="ColoredIcon brand-text-dark" />
                    <span className="closed">Closed</span>
                    {' '}
                    {
                        !_.isEmpty(nextOpen) ?
                            <span className="until">
                                until
                                {' '}
                                {
                                    (when == 'tomorrow') ?
                                        'tomorrow'
                                    : ((when == 'thisWeek') ?
                                        nextOpen.day
                                    :
                                        `next ${nextOpen.day}`
                                      )
                                }
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
