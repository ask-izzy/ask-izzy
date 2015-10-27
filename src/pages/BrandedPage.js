/* @flow */

import DocumentTitle from "react-document-title";
import React from "react";
import { Link } from "react-router";

declare var SITE_DOMAIN: string;

export default class BasePage extends React.Component {

    render(): ReactElement {
        const domain = SITE_DOMAIN;
        const mailLink = `mailto:support@${domain}`;

        return (
            <div className="BrandedPage">
                <DocumentTitle title="Ask Izzy" />
                <main>
                    {this.props.children}
                </main>

                <footer className="branding-footer-container">
                    <div className="about">
                        <Link to="/about">About Ask Izzy</Link>
                    </div>
                    <div className="feedback">
                        <a
                            href={mailLink}
                        >
                        Feedback
                        </a>
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
