/* @flow */

import React from "react";
import { Link } from "react-router-dom";
import DemographicAboriginal from "../icons/demographic-aboriginal.svg";
import DemographicTorresStrait from "../icons/demographic-torres-strait.svg";
import FacebookIcon from "../icons/facebook.svg";
import Instagram from "../icons/instagram.svg";
import config from "../config";
import MobileDetect from "./higherorder/MobileDetect";

class BrandedFooter extends React.Component<{mobileView: boolean}, void> {
    static sampleProps = {
        default: {},
    };

    render() {
        const subject = "Ask Izzy - Feedback";
        const siteMail = config.default.siteMail;
        const mailLink = `mailto:${siteMail}?subject=${subject}`;
        // There is an nginx rewrite to go to the correct donation URL,
        // this reduces duplication.
        const donateLink = "/donate";
        const resourcesLink = "https://www.infoxchange.org/au/ask-izzy";

        return (
            <footer className="branding-footer-container">
                <div>
                    <ul className="footer-list about">
                        <li>
                            <Link to="/about">
                                About Ask Izzy
                            </Link>
                        </li>
                        <li>
                            <Link to="/terms">
                                Our terms of use
                            </Link>
                        </li>
                        <li>
                            <a href={mailLink}>
                                Leave feedback
                            </a>
                        </li>
                        <li>
                            <a href={donateLink}>
                                Donate to us
                            </a>
                        </li>
                        <li>
                            <Link to="/online-safety">
                                Online Safety
                            </Link>
                        </li>
                        <li>
                            <a href={resourcesLink}>
                                Online resources
                            </a>
                        </li>
                        <li>
                            <Link to="/beta-info">
                                🆕 Ask Izzy Beta
                            </Link>
                        </li>
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
                    <div>
                        <a
                            href={
                                "/service/105139-translating" +
                                "-interpreting-service-tis-national"
                            }
                        >
                            TIS Interpreter Hotline
                        </a>
                        <br />
                        {
                            this.props.mobileView ? (
                                <a href="tel:131450">
                                    13 14 50
                                </a>
                            ) : (
                                "13 14 50"
                            )
                        }
                    </div>
                    <div>
                        <div className="full-width">
                            Find us on
                            <a
                                href="https://www.facebook.com/askizzyau"
                                target="_blank"
                                className="flex-align"
                            >
                                <FacebookIcon className="inline-block-icon" />
                            </a>
                            <a
                                href="https://www.instagram.com/askizzyau/"
                                target="_blank"
                                className="flex-align"
                            >
                                <Instagram className="inline-block-icon" />
                            </a>
                        </div>
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
                        Infoxchange acknowledges the traditional custodians of
                        the land and pays respect to Elders both past and
                        present.
                        </small>
                    </p>
                </div>
            </footer>
        );
    }
}

export default MobileDetect(BrandedFooter);
