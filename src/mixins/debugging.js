/* @flow */

import React from "react";

const Debugging = {

    componentDidMount(): void {
        try {
            window.addEventListener("debug", () => {
                this.forceUpdate();
            });
        } catch (error) {
            // pass
        }
    },

    renderDebugging(expl: Object): ReactElement {
        if (!window.debugQueries) {
            return <span />;
        }

        return (
            <div className="Debugging">
                <span className="description">{expl.description}</span>
                <span className="score">{expl.value}</span>
                {(expl.details || []).map(
                    child => this.renderDebugging(child)
                )}
            </div>
        );
    },
};

export default Debugging;
