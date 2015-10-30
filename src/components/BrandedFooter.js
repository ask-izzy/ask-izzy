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
                <div className="about">
                    <Link to="/about">About Ask Izzy</Link>
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
        );
    }

}

export default BrandedFooter;
