/* @flow */

import React from "react";
import { Link } from "react-router";

class BrandedFooter extends React.Component {
    props: void;
    state: void;
    static sampleProps = {
        default: {},
    };

    render() {
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
                <div>
                    <ul className="footer-list information">
                        <li><Link to="/homeless-shelters">
                            About Homeless shelters
                        </Link></li>
                        <li><Link to="/food-banks">
                            About Food banks
                        </Link></li>
                        <li><Link to="/homeless-support">
                            About Homeless support
                        </Link></li>
                        <li><Link to="/homeless-legal-services">
                            About Homeless legal Services
                        </Link></li>
                        <li><Link to="/homeless-financial-support">
                            About Homeless financial support
                        </Link></li>
                        <li><Link to="/homeless-health-care">
                            About Homeless health Care
                        </Link></li>
                    </ul>
                </div>


            </footer>
        );
    }

}

export default BrandedFooter;

