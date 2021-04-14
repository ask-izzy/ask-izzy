/* @flow */

import React from "react";

import components from "../components";
import icons from "../icons";
import QuickExit from "./QuickExit";

type Props = {
    title: string,
    onBackTouchTap: Function,
    backMessage?: string,
}


class AppBar extends React.Component<Props, void> {
    static sampleProps = {
        default: {
            title: "App bar",
            onBackTouchTap: function() {
            },
        },
    };




    render() {
        const redirectUri = "http://www.bom.gov.au/";
        const tooltip = "To leave this website quickly, click the 'Quick" +
            " Exit' button. If you are in immediate danger call 000 " +
            "(Australian emergency line), for advice about family " +
            "violence call 1800 Respect on 1800 737 732 (Helpline).";

        return (
            <div className="AppBarContainer">
                <div className="AppBar">
                    {this.renderBackButton()}
                    <h1 className="title">{this.props.title}</h1>
                    <QuickExit
                        className="button-container"
                        redirectUri={redirectUri}
                        tooltip={tooltip}
                    />
                </div>
                <div className="AppBarSpacer"/>
            </div>
        );
    }

    renderBackButton() {
        return (
            <components.IconButton
                className="BackButton button-container"
                onClick={this.props.onBackTouchTap}
            >
                <icons.ChevronBack/>
                <span className="back-label">
                    {this.props.backMessage}
                </span>
            </components.IconButton>
        )
    }
}

export default AppBar;
