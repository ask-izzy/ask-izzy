/* @flow */

import React from "react";

type Props = {
    plural: boolean
}

class CrisisHeader extends React.Component<Props, void> {
    render() {
        return (
            <h3 className="CrisisHeader">
                {this.props.plural ?
                    "If you need urgent help call one of these numbers"
                    : "If you need urgent help call this number"
                }
            </h3>
        );
    }
}

export default CrisisHeader;
