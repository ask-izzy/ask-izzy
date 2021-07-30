/* @flow */

import * as React from "react";
import AppBar from "./AppBar";

type Props = {
    primaryText: string | React.Node,
    secondaryText?: string | React.Node,
    children?: React.Node,
    bannerName: string,
    className?: string,
    taperColour?: string,
    fixedAppBar?: boolean,
    home?: boolean,
    goBack?: Object,
}

class HeaderBar extends React.Component<Props, void> {
    static sampleProps: any = {
        default: {
            primaryText: "Primary Text",
            secondaryText: "Secondary Text",
            bannerName: "food",
        },
    };

    static defaultProps: any = {
        fixedAppBar: false,
        home: false,
        goBack: {},
    }

    render(): React.Element<"div"> {
        // Search banner is the default
        let headerBarClassName = "HeaderBar";

        if (this.props.bannerName) {
            headerBarClassName += ` ${this.props.bannerName}`;
        }

        if (this.props.className) {
            headerBarClassName += ` ${this.props.className}`;
        }

        if (this.props.taperColour) {
            headerBarClassName += ` taperColour${this.props.taperColour}`;
        }

        return (
            <div className={headerBarClassName}>

                <AppBar
                    transition={!this.props.fixedAppBar}
                    home={this.props.home}
                    breakpoint={this.props.home ? 100 : 30}
                    {...this.props.goBack}
                />
                <div className="primary"
                    tabIndex="0"
                >
                    <h1>{this.props.primaryText}</h1>
                </div>
                {this.renderSecondaryText()}
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
