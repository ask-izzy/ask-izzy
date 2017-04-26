/* @flow */

import React from "react";
import { Link } from "react-router";
import DemographicAboriginal from "../icons/DemographicAboriginal";
import DemographicTorresStrait from "../icons/DemographicTorresStrait";
import config from "../config";

class BrandedFooter extends React.Component {
    props: void;
    state: void;
    static sampleProps = {
        default: {},
    };

    render() {
        const subject = "Ask Izzy - Feedback";
        const siteMail = config.default.siteMail;
        const mailLink = `mailto:${siteMail}?subject=${subject}`;
        const donateLink = "https://www.infoxchange.org/donate-ask-izzy";

        return (
            <footer className="branding-footer-container">
                <div>
                    <ul className="footer-list about">
                        <li><Link to="/about">About Ask Izzy</Link></li>
                        <li><Link to="/terms">Our terms of use</Link></li>
                        <li><a href={mailLink}>Leave feedback</a></li>
                        <li><a href={donateLink}>Donate to us</a></li>
                    </ul>
                </div>
                <hr />
                <div>
                    <div>
                        About the services <br />
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
                    <div>
                        Supported by <br />
                        <ul className="footer-list supporters">
                            <li><a href="https://www.infoxchange.net.au/ask-izzy">Infoxchange</a></li>
                            <li><a href="https://www.google.org">Google</a></li>
                            <li><a href="http://www.rea-group.com">REA Group</a></li>
                            <li><a href="http://www.newscorpaustralia.com">News Corp Australia</a></li>
                        </ul>
                    </div>
                </div>
                <hr />
                <div>
                    <DemographicAboriginal
                        className="small flag"
                    />
                    <DemographicTorresStrait
                        className="small flag"
                    />
                    <p>
                        <small>
                        Infoxchange acknowledges the Traditional Owners of
                        country throughout Australia and recognises their
                        continuing connection to land, waters and community.
                        We pay our respects to them and their cultures; and
                        to elders both past and present.
                        </small>
                    </p>
                </div>
            </footer>
        );
    }

}

export default BrandedFooter;

