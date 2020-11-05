/* @flow */

import React from "react";

import { openUserSnap } from "../../utils/usersnap";

type State = {}

export default class UserSnapResults extends React.Component<{}, State> {

    render() {
        return (
            <div className="UserSnapResults">
                <div className="inner">
                    <h4>
                        Can&apos;t find what you&apos;re looking for?
                    </h4>
                    <button
                        type="submit"
                        onClick={openUserSnap}
                    >
                        Send feedback
                    </button>
                </div>
            </div>
        );
    }
}
