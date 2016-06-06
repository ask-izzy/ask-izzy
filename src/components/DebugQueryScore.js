/* @flow */

import React from "react";

class DebugQueryScore extends React.Component {
    props: Object;
    state: void;

    render() {
        const {expl} = this.props;

        if (!expl) {
            return <div className="DebugQueryScore" />
        }

        return (
            <div className="DebugQueryScore">
                <span className="description">{expl.description}</span>
                <span className="score">{expl.value}</span>
                {(expl.details || []).map(
                    (child) => <DebugQueryScore expl={child} />
                )}
            </div>
        );
    }

}

export default DebugQueryScore;
