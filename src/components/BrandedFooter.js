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
                    Supported by <ul className="footer-list supporters">
                        <li><a href="https://www.infoxchange.net.au/ask-izzy">Infoxchange</a></li>
                        <li><a href="https://www.google.org">Google</a></li>
                        <li><a href="http://www.rea-group.com">REA Group</a></li>
                        <li><a href="http://www.newscorpaustralia.com">News Corp Australia</a></li>
                    </ul>
                </div>
            </footer>
        );
    }

}

export default BrandedFooter;
