import type {Element as ReactElement} from "React";
import React from "react";
import Link from "../components/base/Link";
import icons from "../icons"
import { donateLink, aboutLink } from "../constants/urls.js"

function BrandedFooter(): ReactElement<"footer"> {
    const LOGO: strin = "/images/ask-izzy-logo-single-line-yellow.svg";

    return (
        <footer
            className="branding-footer-container"
            aria-label="Page footer"
        >
            <div
                className="main-links"
                aria-label="Helpful information"
            >
                <div
                    role="region"
                    aria-labelledby="addInfo"
                    className="additional-information"
                >
                    <h1 id="addInfo">
                        Additional information
                    </h1>
                    <ul>
                        <li>
                            <Link to="/using-ask-izzy">
                                Help using Ask Izzy
                            </Link>
                        </li>
                        <li>
                            <Link to="/food-info">
                                Food Support
                            </Link>
                        </li>
                        <li>
                            <Link to="/data-privacy">
                                Data Privacy
                            </Link>
                        </li>
                        <li>
                            <Link to="/online-safety">
                                Online Safety
                            </Link>
                        </li>
                        <li>
                            <Link to="/covid-19-support">
                                COVID-19
                            </Link>
                        </li>
                    </ul>
                </div>
                <div
                    role="region"
                    aria-labelledby="homelessnessServices"
                    className="homelessness-services"
                >
                    <h1 id="homelessnessServices">
                        Homelessness services
                    </h1>
                    <ul>
                        <li>
                            <Link to="/homeless-shelters">
                                Shelters
                            </Link>
                        </li>
                        <li>
                            <Link to="/homeless-legal-services">
                                Legal Help
                            </Link>
                        </li>
                        <li>
                            <Link to="/homeless-financial-support">
                                Financial Support
                            </Link>
                        </li>
                        <li>
                            <Link to="/homeless-health-care">
                                Health Care
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="about-links">
                    <h1>Ask Izzy</h1>
                    <ul>
                        <li>
                            <Link to={aboutLink}>
                                About Ask Izzy
                            </Link>
                        </li>
                        <li>
                            <Link to="/what-is-new">
                                What's new
                            </Link>
                        </li>
                        <li>
                            <Link to={donateLink}>
                                Donate to us
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={
                                    `mailto:${process.env.NEXT_PUBLIC_SITE_EMAIL}` +
                                        "?subject=" +
                                        encodeURIComponent(
                                            `Your Ask Izzy feedback`) +
                                        "&body=" +
                                        encodeURIComponent(
                                            `Service name:

                                            Contact name:

                                            Contact number:

                                            Contact email:

                                            Details of change:

                                            `.replace(/^ +/gm, "")
                                        )
                                }
                            >
                            Leave feedback
                            </Link>
                        </li>
                        <li>
                            <Link to="/terms">
                                Terms of use
                            </Link>
                        </li>


                    </ul>
                </div>
                <div className="service-providers">
                    <h1>For service providers</h1>
                    <ul>
                        <li>
                            <Link to="/add-service">
                                Add a service
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={
                                    `mailto:${process.env.NEXT_PUBLIC_SITE_EMAIL}` +
                                    "?subject=" +
                                    encodeURIComponent(
                                        `Update service details`) +
                                    "&body=" +
                                    encodeURIComponent(
                                        `Service name:

                                        Contact name:

                                        Contact number:

                                        Contact email:

                                        Details of change:

                                        `.replace(/^ +/gm, "")
                                    )
                                }
                            >
                            Update service details
                            </Link>
                        </li>
                        <li>
                            <Link to="https://about.askizzy.org.au/downloads/">
                                Ask Izzy resources
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="supporters">
                    <h1>Founding partners</h1>
                    <ul>
                        <li>
                            <Link to="https://www.google.org">Google</Link>
                        </li>
                        <li>
                            <Link to="https://www.rea-group.com">REA Group</Link>
                        </li>
                        <li>
                            <Link to="https://www.newscorpaustralia.com">
                                News Corp Australia
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="socials">
                    <ul>
                        <li>
                            <Link
                                to="https://www.facebook.com/askizzyau"
                                className="icon-link"
                            >
                                <icons.Facebook
                                    className="inline-icon inline-block-icon"
                                />
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="https://www.instagram.com/askizzyau/"
                                className="icon-link"
                            >
                                <icons.Instagram
                                    className="inline-icon inline-block-icon"
                                />
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>
            <div className="other-content">
                <div className="about">
                    <img
                        src={LOGO}
                        className="other-content-icon"
                        aria-hidden={true}
                    />
                    <p>
                        Ask Izzy is powered by{" "}
                        <Link to="https://www.infoxchange.org/au">
                            Infoxchange
                        </Link>, a not-for-profit social enterprise that
                        has been delivering technology for social justice
                        for over 30 years.
                    </p>
                </div>
                <div
                    role="contentinfo"
                    aria-label="Acknowledgements"
                    className="acknowledgements"
                >
                    <icons.AboriginalFlag
                        className="other-content-icon"
                        alt="Australian Aboriginal flag"
                    />
                    <icons.TorresStraitIslandersFlag
                        className="other-content-icon"
                        alt="Torres Strait Islander flag"
                    />
                    <p>
                        Infoxchange acknowledges the traditional custodians
                        of the land and pays respect to Elders both
                        past and present.
                    </p>
                </div>
                <div className="other-acknowledgements">
                Ask Izzy is owned and operated by Infoxchange.
                © {new Date().getFullYear()} Infoxchange
                </div>
            </div>

        </footer>
    )
}

export default BrandedFooter