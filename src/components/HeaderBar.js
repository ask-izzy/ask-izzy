/* @flow */

import React from "react";

class HeaderBar extends React.Component {
    props: {
        primaryText: any,
        secondaryText?: any,
        children?: any,
    };
    state: void;

    static sampleProps = {default: {
        primaryText: "Primary Text",
        secondaryText: "Secondary Text",
    }};

    render() {
        return (
            <div className="HeaderBar">
                <div className="primary">
                    {this.props.primaryText}
                </div>
                {this.renderSecondaryText()}
                {this.props.children}
            </div>
        );
    }

    renderSecondaryText() {
        if (this.props.secondaryText) {
            return (
                <div className="secondary">
                    {this.props.secondaryText}
                </div>
            )
        }
    }
}

export default HeaderBar;
