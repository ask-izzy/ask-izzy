/* @flow */

"use strict";

import React from "react";
import moment from "moment";

import Collapser from "./Collapser";
import OpeningTimes from "./OpeningTimes";

function formatTime(str: string): string {
    return moment(str, 'HH:mm:ss').format('h:mm A');
}

export default class CollapsedOpeningTimes extends React.Component {

    render(): React.Element {
        var openingHours = this.props.object.opening_hours;

        return (
            <div>
                <OpeningTimes object={this.props.object.open} />
                {openingHours.length > 1 ?
                    <Collapser
                        message="All times"
                    >
                    <ul>
                    {openingHours.map(record =>
                        <li>
                            {record.day}
                            {' '}
                            {formatTime(record.open)}
                            &ndash;
                            {formatTime(record.close)}
                        </li>
                    )}
                    </ul>
                    </Collapser>
                :
                    ''
                }
            </div>
        );
    }
}
