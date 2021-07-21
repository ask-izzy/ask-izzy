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
    static sampleProps: any = {
        default: {
            primaryText: "Primary Text",
            secondaryText: "Secondary Text",
            bannerName: "food",
        },
    };

    render(): React.Element<"div"> {
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
                <div className="primary"
                    tabIndex="0"
                >
                    {this.props.primaryText}
                </div>
                {this.props.secondaryText && this.renderSecondaryText()}
                {this.props.children}
            </div>
        );
    }

    renderSecondaryText(): void | React.Element<"div"> {
        if (this.props.secondaryText) {
            return (
                <div className="secondary"
                    tabIndex="0"
                >
                    {this.props.secondaryText}
                </div>
            )
        }
    }
}

export default HeaderBar;
