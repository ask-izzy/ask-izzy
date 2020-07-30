/* @flow */

import React from "react";
import storage from "../storage"
import PropTypes from "proptypes"

type Props = {}

class ConsensualTrackingBar extends React.Component<Props, void> {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    confirmConsent(hasConsented: boolean): void {
        storage.setItem('consensual-user-tracking', hasConsented)
        this.context.router.push(
            '/',
        );
        location.reload()
    }

    render() {
        return (
            <div className="ConsensualTrackingBar">
                <div className="text">
                    ⚠️ Tracking Enabled - <button onClick={this.confirmConsent.bind(this, false)}>Disable</button>
                </div>
            </div>
        );
    }
}

export default ConsensualTrackingBar;
