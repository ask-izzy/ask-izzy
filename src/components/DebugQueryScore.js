/* @flow */

import React from "react";

class DebugQueryScore extends React.Component {

    render(): ReactElement {
        const {expl} = this.props;

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
