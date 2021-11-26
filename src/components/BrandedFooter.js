/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import Link from "../components/base/Link";
import icons from "../icons"
import LinkButton from "./LinkButton";
import config from "../config";
import { donateLink, aboutLink } from "../constants/urls.js"
import ScreenReader from "./ScreenReader";

export default class BrandedFooter
    extends React.Component<{}, void> {

    /* Begin hack for dealing with multiple columns
     *
     * Remove when "break-before: always;" is supported by all the browsers
     * we care about. We need to set the height of the footer so calculate
     * the height of each column and set container to the hight of the largest
     * column.
     */
    footerHeightSetter: (() => void) = () => {
        if (
            typeof window === "undefined" ||
            (
                window.CSS &&
                window.CSS.supports("break-before", "always")
            )
        ) {
            return
        }
        const container = document.querySelector(
            ".branding-footer-container .middle-box"
        )
        if (!container || !document.body) {
            return
        }
        if (window.innerWidth > 800 && container.style.height) {
            // Window larger than max-footer width so no need to change height
        } else if (container.clientWidth > 550) {
            // Footer has 2 columns so set height
            const getColHeight = (contentsClasses) => {
                const contents = container.querySelectorAll(contentsClasses)
                if (!contents) {
                    return 0
                }
                return Array.from(contents)
                    .map(elm => elm.clientHeight)
                    .reduce((itemA, itemB) => itemA + itemB, 0)
            }
            container.style.height = (
                Math.max(
                    getColHeight(
                        ".about, .about-links, .support-links, .supporters"
                    ),
                    getColHeight(".socials, .for-service-providers")
                ) + 5
            ) + "px"
        } else {
            // Footer has 1 column so remove height
            container.style.height = ""
        }
    }

    componentDidMount(): void {
        this.footerHeightSetter()
        // Set footer height on resize
        if (
            typeof window != "undefined" &&
            (
                !window.CSS ||
                !window.CSS.supports("break-before", "always")
            )
        ) {
            window.addEventListener("resize", this.footerHeightSetter)
        }
    }

    componentWillUnmount(): void {
        // Remove footer height setter on resize
        if (
            typeof window != "undefined" &&
            (
                !window.CSS ||
                !window.CSS.supports("break-before", "always")
            )
        ) {
            window.removeEventListener("resize", this.footerHeightSetter)
        }
    }
    /* end hack */

    render: (() => ReactElement<"footer">) = () => (
        <footer
            role="contentinfo"
            className="branding-footer-container"
            aria-labelledby="helpfulInformation"
        >
            <ScreenReader>
                <span id="helpfulInformation">
                    Helpful information.
                </span>
            </ScreenReader>
            <div className="top-box">
                <div
                    role="region"
                    aria-labelledby="addInfo"
                    className="additional-information"
                >
                    <h1 id="addInfo">
                        Additional Information
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
                        Homelessness Services
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
            </div>
            <div
                role="region"
                aria-labelledby="links"
                className="middle-box"
            >
                <ScreenReader>
                    <span id="links">
                        Footer Links.
                    </span>
                </ScreenReader>
                <div className="about">
                    <p tabIndex="0">
                        Ask Izzy is powered by{" "}
                        <Link to="https://www.infoxchange.org/au">
                            Infoxchange
                        </Link>, a not-for-profit social enterprise that
                        has been delivering technology for social justice
                        for over 30 years.
                    </p>
                </div>
                <div className="about-links">
                    <ul>
                        <li>
                            <Link to={aboutLink}>
                                About Ask Izzy
                            </Link>
                        </li>
                        <li>
                            <Link to="/terms">
                                Terms of use
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="support-links">
                    <ul>
                        <li>
                            <Link to={donateLink}>
                                <icons.Heart />
                                <div>
                                    Donate to us.
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={
                                    `mailto:${config.default.siteMail}` +
                                    `?subject=${"Ask Izzy - Feedback"}`
                                }
                            >
                                <icons.Chat
                                    className="small"
                                />
                                <div>
                                    Leave feedback.
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="supporters">
                    Ask Izzy founding partners:<br />
                    <ul>
                        <li>
                            <Link to="https://www.google.org">Google</Link>
                            <span className="comma">,</span>
                        </li>
                        <li>
                            <Link to="https://www.rea-group.com">REA Group</Link>
                            <span className="comma">,</span>
                        </li>
                        <li>
                            <Link to="https://www.newscorpaustralia.com">
                                News Corp Australia
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="socials">
                    <span>Find us on:</span>
                    <ul>
                        <li>
                            <Link
                                to="https://www.facebook.com/askizzyau"
                                className="flex-align"
                            >
                                <icons.Facebook
                                    className="inline-icon inline-block-icon"
                                />
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="https://www.instagram.com/askizzyau/"
                                className="flex-align"
                            >
                                <icons.Instagram
                                    className="inline-icon inline-block-icon"
                                />
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="for-service-providers">
                    <h1>For Service Providers</h1>
                    <div className="links">
                        <LinkButton to="/add-service">
                            <icons.Plus
                                className="small"
                            />
                            <span>Add a service</span>
                        </LinkButton>
                        <LinkButton to={encodeURI(
                            `mailto:${config.default.siteMail}` +
                            `?subject=Your Ask Izzy feedback` +
                            `&body=Service name:\n\n` +
                            `Contact name:\n\n` +
                            `Contact number:\n\n` +
                            `Contact email:\n\n` +
                            `Details of change:\n\n`
                        )}
                        >
                            <icons.Pencil
                                className="small"
                            />
                            <span>Update service details</span>
                        </LinkButton>
                        <Link to="https://about.askizzy.org.au/downloads/">
                            Ask Izzy resources
                        </Link>
                    </div>
                </div>
            </div>
            <div
                role="region"
                className="bottom-box"
                aria-labelledby="acknowledgements"
            >
                <ScreenReader>
                    <span id="acknowledgements">
                        Acknowledgements.
                    </span>
                </ScreenReader>
                <div tabIndex="0">
                    <div className="flags">
                        <icons.AboriginalFlag
                            className="flag"
                        />
                        <icons.TorresStraitIslandersFlag
                            className="flag"
                        />
                    </div>
                    <p>
                        Infoxchange acknowledges the traditional custodians
                        of the land and pays respect to Elders both
                        past and present.
                    </p>
                </div>
                <div tabIndex="0">
                    Ask Izzy is owned and operated by Infoxchange.
                    © {new Date().getFullYear()} Infoxchange
                </div>
            </div>
        </footer>
    )
}
