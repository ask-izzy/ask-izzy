/* @flow */

import React from "react";

class HeaderBar extends React.Component {
    props: Object;
    state: Object;
    static propTypes = {
        primaryText: React.PropTypes.node.isRequired,
        secondaryText: React.PropTypes.node,

        // FIXME: icon
    };

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
