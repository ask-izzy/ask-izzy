/* @flow */

import DocumentTitle from "react-document-title";
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

    render(): React.Element {
        return (
            <div className="BasePage">
                <DocumentTitle title="Ask Izzy" />
                <main>
                    <Router.RouteHandler />
                </main>
                <footer className="branding-footer-container">
                    <div>
                        <a href="#">About Ask Izzy</a>
                    </div>
                    <div>
                        Supported by
                    </div>
                    <div className="logos">
                        <img src="/static/infoxchange.png"
                        alt="Infoxchange" />
                        <img src="/static/google.png" alt="Google" />
                    </div>
                    <div className="logos">
                        <img src="/static/rea.png" alt="REA Group" />
                        <img src="/static/newscorp.png"
                             alt="News Corp Australia" />
                    </div>
                </footer>
            </div>
        );
    }
}
