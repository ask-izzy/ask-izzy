/* @flow */

import React from "react";
import storage from "../storage";
import Collapser from "./Collapser";

class DebugContainer extends React.Component {
    props: {
        message: string,
        children?: any,
    };
    state: void;

    componentDidMount(): void {
        try {
            this.window().addEventListener("debug", () => {
                this.forceUpdate();
            });
        } catch (error) {
            // pass
        }
    }

    window(): Object {
        if (typeof window != "undefined") {
            return window;
        }
        return {addEventListener: () => null};
    }

    render() {
        if (!storage.getDebug()) {
            return <span />;
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
