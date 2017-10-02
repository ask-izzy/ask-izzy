/* @flow */

import React from "react";

class HeaderBar extends React.Component {
    props: {
        primaryText: any,
        secondaryText?: any,
        children?: any,
        bannerName: any,
        alternateBackgroundColor: bool,
    };
    state: void;

    static sampleProps = {default: {
        primaryText: "Primary Text",
        secondaryText: "Secondary Text",
        bannerName: "food",
        alternateBackgroundColor: false,
    }};

    render() {
        // Search banner is the default
        let bannerClassName = "HeaderBarBanner search";
        let bannerAltText = "";
        let headerBarClassName = "HeaderBar search";

        if (this.props.bannerName) {
            bannerClassName = "HeaderBarBanner " + this.props.bannerName;
            headerBarClassName = "HeaderBar " + this.props.bannerName;
        }
        if (this.props.bannerName === "homepage") {
            bannerAltText = "AskIzzy";
        }

        if (this.props.alternateBackgroundColor) {
            bannerClassName += " alternate-fg-color" ;
        }

        return (
            <div className={headerBarClassName}>
                <div className={bannerClassName}
                    alt={bannerAltText}
                >
                    <div className="BlackBanner"
                        alt=""
                    />
                </div>
                <div className="HeaderBarContent">
                    <div className="primary">
                        {this.props.primaryText}
                    </div>
                    {this.renderSecondaryText()}
                    {this.props.children}
                </div>
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
