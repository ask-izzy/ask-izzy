/* @flow */

import React from "react";

class DebugQueryScore extends React.Component {

    render(): ReactElement {
        const {search} = this.props;

        if (!search) {
            return <div className="DebugSearch"/>;
        }

        return (
            <div className="DebugSearch">
                {Object.keys(search).map((key) =>
                    <pre key={key}>
                        <span className="key">
                            {key}
                        </span> = <span className="value">
                            {JSON.stringify(search[key])}
                        </span>
                    </pre>
                )}
            </div>
        );
    }

}

export default DebugQueryScore;
