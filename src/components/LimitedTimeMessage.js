/* @flow */

import React from "react";
import moment from "moment";

type Props = {
    from?: Moment,
    to?: Moment,
    children?: any
}

export default class LimitedTimeMessage extends React.Component<Props, void> {
    isVisible(): boolean {
        if (typeof window == "undefined") {
            return false; // Do not render server-side
        }

        if (this.props.from && this.props.from.isAfter(moment())) {
            return false; // Do not render before 'from'
        }

        if (this.props.to && this.props.to.isBefore(moment())) {
            return false; // Do not render after 'to'
        }

        return true;
    }

    render() {
        if (!this.isVisible()) {
            return (
                <span className="LimitedTimeMessage" />
            );
        }

        return (
            <span className="LimitedTimeMessage">
                {this.props.children}
            </span>
        );
    }
}
