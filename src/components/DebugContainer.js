/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";

import Collapser from "./general/Collapser";
import debugModeContext from "@/contexts/debug-mode-context";

type Props = {
    message: string,
    children?: any,
    externalCollapsed?: boolean,
}

class DebugContainer extends React.Component<Props, void> {
    static contextType: any = debugModeContext;

    render(): null | ReactElement<"div"> {
        const [debugMode] = this.context;
        if (!debugMode) {
            return null;
        }

        return (
            <div className="DebugContainer">
                <Collapser
                    expandMessage={this.props.message}
                    collapseMessage={this.props.message}
                    externalCollapsed={this.props.externalCollapsed}
                >
                    {this.props.children}
                </Collapser>
            </div>
        );
    }
}

export default DebugContainer;
