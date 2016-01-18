/* @flow */

import React from "react";
import { Link } from "react-router";

class BrandedFooter extends React.Component {
    static sampleProps = {
        default: {},
    };

    render(): ReactElement {
        return (
            <footer className="branding-footer-container">
                <div>
                    <ul className="footer-list">
                        <li><Link to="/about">About Ask Izzy</Link></li>
                        <li><Link to="/terms">Terms of use</Link></li>
                    </ul>
                </div>
                <div>
                    Supported by <ul className="footer-list">
                        <li>Infoxchange</li>
                        <li>Google</li>
                        <li>REA Group</li>
                        <li>News Corp Australia</li>
                    </ul>
                </div>
            </footer>
        );
    }

}

export default BrandedFooter;
