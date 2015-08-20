/* @flow */

import React from "react";
import Router from 'react-router';
import mui from "material-ui";
import theme from "../constants/theme";
var ThemeManager = new mui.Styles.ThemeManager();
ThemeManager.setTheme(theme);
ThemeManager.contentFontFamily
	= 'Gotham Rounded A,Gotham Rounded B,sans-serif';

export default class BasePage extends React.Component {

    getChildContext(): Object {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    render(): React.Element {
        return (
            <Router.RouteHandler key={this.context.router.getCurrentPath()} />
        );
    }

}

BasePage.childContextTypes = {
    muiTheme: React.PropTypes.object,
};
