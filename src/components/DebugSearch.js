/* @flow */

import type {Element} from "React";
import React from "react";

type Props = {
    search: ?Object,
}

class DebugQueryScore extends React.Component<Props, void> {
    render(): Element<"div"> {
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
