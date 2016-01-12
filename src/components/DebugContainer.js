/* @flow */

import React from "react";

class DebugContainer extends React.Component {

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

    render(): ReactElement {
        if (!this.window().debugQueries) {
            return <span />;
        }

        return (
            <div className="DebugContainer">
                {this.props.children}
            </div>
        );
    }
}

export default DebugContainer;
