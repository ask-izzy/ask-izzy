import type {ReactElement} from "react";
import React from "react";

import Collapser from "./general/Collapser";
import debugModeContext from "@/contexts/debug-mode-context";

type Props = {
    message: string,
    children?: any,
    externalCollapsed?: boolean,
}

class DebugContainer extends React.Component<Props> {
    static contextType: any = debugModeContext;

    render(): null | ReactElement<"div"> {
        // @ts-expect-error TODO(ts-migration): Type 'unknown' must have a '[Symbol.iterator]()' method that returns an…
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
