/* @flow */

import React from "react";

class DebugQueryScore extends React.Component {
    props: {
        search: ?Object,
    };
    state: void;

    render() {
        const {search} = this.props;

        if (!search) {
            return <div className="DebugSearch"/>;
        }

        return (
            <div className="DebugSearch">
                <h5>ISS params</h5>
                <pre>
                    {JSON.stringify(search, null, 4)}
                </pre>
            </div>
        );
    }

}

export default DebugQueryScore;
