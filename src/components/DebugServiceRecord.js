/* @flow */

import React from "react";
import DebugContainer from "./DebugContainer";

type Props = {
    object: Object
}

export default class DebugServiceRecord extends React.Component<Props, void> {
    render() {
        // need to remove _explanation to get ...rest
        /* eslint-disable no-unused-vars */
        const {_explanation, ...rest} = this.props.object;

        return (
            <DebugContainer message="ISS Object">
                <div className="DebugServiceRecord">
                    <pre>{JSON.stringify(rest, null, 4)}</pre>
                </div>
            </DebugContainer>
        );
    }
}
