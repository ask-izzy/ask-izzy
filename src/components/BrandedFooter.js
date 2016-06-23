/* @flow */

import React from "react";
import { Link } from "react-router";
import DemographicAboriginal from "../icons/DemographicAboriginal";

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
                    <DemographicAboriginal
                        className="small aboriginal-flag"
                    />
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
                    About Homelessness:
                    {' '}
                    <ul className="footer-list information">
                        <li><Link to="/homeless-shelters">
                            Shelters
                        </Link></li>
                        <li><Link to="/food-banks">
                            Food banks
                        </Link></li>
                        <li><Link to="/homeless-support">
                            Support
                        </Link></li>
                        <li><Link to="/homeless-legal-services">
                            Legal Services
                        </Link></li>
                        <li><Link to="/homeless-financial-support">
                            Financial support
                        </Link></li>
                        <li><Link to="/homeless-health-care">
                            Health Care
                        </Link></li>
                    </ul>
                </div>


            </footer>
        );
    }

}

export default BrandedFooter;

