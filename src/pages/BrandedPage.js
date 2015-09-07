/* @flow */

import DocumentTitle from "react-document-title";
import React from "react";
import Router from 'react-router';

export default class BasePage extends React.Component {

    render(): React.Element {
        return (
            <div className="BrandedPage">
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
                    <div className="supporters">
                        Infoxchange |
                        Google |
                        REA Group |
                        News Corp Australia
                    </div>
                </footer>
            </div>
        );
    }
}
