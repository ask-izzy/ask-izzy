/* @flow */

import moment from "moment";
import mui from "material-ui";
import React, { PropTypes } from "react";

import colors from "../constants/theme";
var palette = colors.getPalette();

function formatTime(in_): string {
    return moment(in_, 'HH:mm:ss').format('h:mm A');
}

class OpeningTimes extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        object: PropTypes.object.isRequired,
    };

    render(): React.Element {
        var {
            object,
        } = this.props;

        var todayOpen = object.opening_hours[
            moment().day()
        ];

        var nextOpen = object.opening_hours[
            (moment().day() + 1) % object.opening_hours.length
        ];

        console.log(todayOpen);
        console.log(nextOpen);

        if (object.now_open.now_open) {
            // get closing time
            return (
                <div>
                    <span>Now open</span>&nbsp;
                    <span>Closes {formatTime(todayOpen.close)}</span>
                </div>
            );
        } else {
            return (
                <div>
                    <span>Currently closed</span>&nbsp;
                    {
                        nextOpen ?
                            <span>
                                Opens {nextOpen.day}&nbsp;
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
