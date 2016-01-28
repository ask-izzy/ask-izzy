/* @flow */

import React from "react";
import moment from "moment";

export default class EmbargoMessage extends React.Component {

    render(): ReactElement {
        if (moment().isAfter(moment("2016-01-28T23"))) {
            return (
                <p className="branding-copy EmbargoMessage" />
            );
        }

        return (
            <p className="branding-copy EmbargoMessage">
                Pre-launch release embargoed until
                10:00am Friday 29 January
            </p>
        );
    }
}
