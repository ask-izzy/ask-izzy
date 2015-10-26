/* @flow */

import DocumentTitle from "react-document-title";
import React from "react";

declare var SITE_DOMAIN: string;

export default class BasePage extends React.Component {

    render(): ReactElement {
        const domain = SITE_DOMAIN;

        return (
            <div className="BrandedPage">
                <DocumentTitle title="Ask Izzy" />
                <main>
                    {this.props.children}
                </main>

                <footer className="branding-footer-container">
                    <div className="about">
                        <a href="#">About Ask Izzy</a>
                    </div>
                    <div>
                        Supported by <ul className="supporters">
                            <li className="supporter">Infoxchange</li>
                            <li className="supporter">Google</li>
                            <li className="supporter">REA Group</li>
                            <li className="supporter">News Corp Australia</li>
                        </ul>
                    </div>
                </footer>
            </div>
        );
    }
}
