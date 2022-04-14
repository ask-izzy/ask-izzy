/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import DebugContainer from "./DebugContainer";

type Props = {
    object: Object
}

export default class DebugServiceRecord extends React.Component<Props, void> {
    render(): ReactNode {
        // need to remove _explanation to get ...rest
        // Remove siblingServices to stop circle ref.
        /* eslint-disable no-unused-vars */
        const {_explanation, _siblingServices, ...rest} = this.props.object;

        return <>
            <pre>{JSON.stringify(rest.service_types.map(type => type.name), null, 4)}</pre>
        </>

        return (
            <DebugContainer message="ISS Object">
                <div className="DebugServiceRecord">
                    <pre>{JSON.stringify(rest, null, 4)}</pre>
                </div>
            </DebugContainer>
        );
    }
}
