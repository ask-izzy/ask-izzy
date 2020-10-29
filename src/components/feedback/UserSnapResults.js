/* @flow */

import React from "react";

type State = {}

export default class UserSnapResults extends React.Component<{}, State> {

    openUserSnap(event: SyntheticInputEvent<>): void {
        event.preventDefault();
        window.Usersnap.logEvent("display_menu");
    }

    render() {
        return (
            <div className="UserSnapResults">
                <div className="inner">
                    <h4>
                        Can&apos;t find what you&apos;re looking for?
                    </h4>
                    <button
                        type="submit"
                        onClick={this.openUserSnap}
                    >
                        Send feedback
                    </button>
                </div>
            </div>
        );
    }
}
