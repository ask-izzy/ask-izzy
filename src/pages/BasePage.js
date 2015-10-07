/* @flow */

import React from "react";
import ThemeManager from "material-ui/lib/styles/theme-manager";

import theme from "../constants/theme";

ThemeManager.contentFontFamily =
    "Gotham Rounded A,Gotham Rounded B,sans-serif";

export default class BasePage extends React.Component {

    // flow:disable
    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    };

    getChildContext(): Object {
        return {
            muiTheme: ThemeManager.getMuiTheme(theme),
        };
    }

    render(): ReactElement {
        return (
            <div className="BasePage">
                <main>
                    {this.props.children}
                </main>
            </div>
        );
    }
}
