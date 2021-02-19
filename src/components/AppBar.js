/* @flow */

import React from "react";

import components from "../components";
import Link from "../components/Link";
import icons from "../icons";

type Props = {
    title: string,
    onBackTouchTap: Function,
    backMessage?: string,
}

class AppBar extends React.Component<Props, void> {
    static sampleProps = {
        default: {
            title: "App bar",
            onBackTouchTap: function() {},
        },
    };


    render() {
        let redirectUri = "http://www.bom.gov.au/";
        let tooltip = "To leave this website quickly, click the 'Quick" +
            " Exit' button. If you are in immediate danger call 000 " +
            "(Australian emergency line), for advice about family " +
            "violence call 1800 Respect on 1800 737 732 (Helpline).";

        return (
            <div className="AppBarContainer">
                <div className="AppBar">
                    {this.renderBackButton()}
                    <h1 className="title">{this.props.title}</h1>
                    <div className="button-container">
                        <Link className="quick-exit"
                            to={redirectUri}
                            title={tooltip}
                        >
                            <div className="quick-exit">
                                <span className="longer-text">
                                    Quick Exit ⨉
                                </span>
                                <span className="shorter-text">
                                    Exit ⨉
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="AppBarSpacer" />
            </div>
        );
    }

    renderBackButton() {
        return (
            <components.IconButton
                className="BackButton button-container"
                onClick={this.props.onBackTouchTap}
            >
                <icons.ChevronBack />
                <span className="back-label">
                    {this.props.backMessage}
                </span>
            </components.IconButton>
        )
    }
}

export default AppBar;
