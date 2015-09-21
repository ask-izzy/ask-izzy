/* @flow */

import React from "react";
import Router from 'react-router';
import mui from "material-ui";

import theme from "../constants/theme";

var ThemeManager = new mui.Styles.ThemeManager();
ThemeManager.setTheme(theme);
ThemeManager.contentFontFamily =
    'Gotham Rounded A,Gotham Rounded B,sans-serif';

export default class BasePage extends React.Component {

    // flow:disable
    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    };

    getChildContext(): Object {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    render(): ReactElement {
        return (
            <div className="BasePage">
                <main>
                    <Router.RouteHandler />
                </main>
            </div>
        );
    }
}
