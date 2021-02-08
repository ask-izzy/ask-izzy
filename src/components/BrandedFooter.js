/* @flow */

import React from "react";
import { Link } from "react-router-dom";
import icons from "../icons"
import LinkButton from "./LinkButton";
import config from "../config";

export default class BrandedFooter
    extends React.Component<{}, void> {
    static sampleProps = {
        default: {},
    };

    /* Begin hack for dealing with multiple columns
     *
     * Remove when "break-before: always;" is supported by all the browsers
     * we care about. We need to set the height of the footer so calculate
     * the height of each column and set container to the hight of the largest
     * column.
     */
    footerHeightSetter = () => {
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

    render = () => (
        <footer className="branding-footer-container">
            <div className="top-box">
                <div className="additional-information">
                    <h1>Additional Information</h1>
                    <ul>
                        <li>
                            <Link to="/using-ask-izzy">
                                Using Ask Izzy
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
                        <li>
                            <Link to="/beta-info">
                                Ask Izzy Beta
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="homelessness-services">
                    <h1>Homelessness Services</h1>
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
            <div className="middle-box">
                <div className="about">
                    Ask Izzy is powered by <a href="https://www.infoxchange.org/au">Infoxchange</a>, a not-for-profit social enterprise that has been delivering technology for social justice for over 30 years.
                </div>
                <div className="about-links">
                    <Link to="/about">
                        About Ask Izzy
                    </Link>
                    <span className="spacer">|</span>
                    <Link to="/terms">
                        Terms of use
                    </Link>
                </div>
                <div className="support-links">
                    <ul>
                        <li>
                            <a href="/donate">
                                <icons.Heart
                                    className="small"
                                />
                                Donate to us
                            </a>
                        </li>
                        <li>
                            <a
                                href={
                                    `mailto:${config.default.siteMail}` +
                                    `?subject=${"Ask Izzy - Feedback"}`
                                }
                            >
                                <icons.Chat
                                    className="small"
                                />
                                Leave feedback
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="supporters">
                    Ask Izzy founding partners:<br />
                    <ul>
                        <li>
                            <a href="https://www.google.org">Google</a>
                            <span className="comma">,</span>
                        </li>
                        <li>
                            <a href="https://www.rea-group.com">REA Group</a>
                            <span className="comma">,</span>
                        </li>
                        <li>
                            <a href="https://www.newscorpaustralia.com">
                                News Corp Australia
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="socials">
                    <span>Find us on:</span>
                    <ul>
                        <li>
                            <a
                                href="https://www.facebook.com/askizzyau"
                                target="_blank"
                                className="flex-align"
                            >
                                <icons.Facebook
                                    className="inline-icon inline-block-icon"
                                />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.instagram.com/askizzyau/"
                                target="_blank"
                                className="flex-align"
                            >
                                <icons.Instagram
                                    className="inline-icon inline-block-icon"
                                />
                            </a>
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
                        <a href="https://www.infoxchange.org/au/ask-izzy">
                            Ask Izzy resources
                        </a>
                    </div>
                </div>
            </div>
            <div className="bottom-box">
                <div>
                    <div className="flags">
                        <icons.AboriginalFlag
                            className="flag"
                        />
                        <icons.TorresStraitIslandersFlag
                            className="flag"
                        />
                    </div>
                    <p>
                        Infoxchange acknowledges the traditional custodians of
                        the land and pays respect to Elders both past and
                        present.
                    </p>
                </div>
                <div>
                    Ask Izzy is owned and operated by Infoxchange.
                    © {new Date().getFullYear()} Infoxchange
                </div>
            </div>
        </footer>
    )
}
