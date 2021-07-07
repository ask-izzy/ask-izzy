/* @flow */

import React from "react";

import Collapser from "./Collapser";
import debugModeContext from "../contexts/debug-mode-context";

type Props = {
    message: string,
    children?: any,
}

class DebugContainer extends React.Component<Props, void> {
    static contextType = debugModeContext;

    render() {
        const [debugMode] = this.context
        if (!debugMode) {
            return null;
        }

        return (
            <div className="DebugContainer">
                <Collapser message={this.props.message}>
                    {this.props.children}
                </Collapser>
            </div>
        );
    }
}

export default DebugContainer;
