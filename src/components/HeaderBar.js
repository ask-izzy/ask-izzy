/* @flow */

import * as React from "react";

type Props = {
    primaryText: string | React.Node,
    secondaryText?: string | React.Node,
    children?: React.Node,
    bannerName: string,
    taperColour?: string,
}

class HeaderBar extends React.Component<Props, void> {
    static sampleProps = {
        default: {
            primaryText: "Primary Text",
            secondaryText: "Secondary Text",
            bannerName: "food",
        },
    };

    render() {
        // Search banner is the default
        let headerBarClassName = "HeaderBar";

        if (this.props.bannerName) {
            headerBarClassName += ` ${this.props.bannerName}`;
        }

        if (this.props.taperColour) {
            headerBarClassName += ` taperColour${this.props.taperColour}`;
        }

        return (
            <div className={headerBarClassName}>
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
