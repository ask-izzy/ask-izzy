/* @flow */
/* eslint-disable max-len */

import * as React from "react";
import { Link } from "react-router";
import StaticPage from "./StaticPage";
import MobileDetect from "../components/higherorder/MobileDetect";
import sendEvent from "../google-tag-manager";
import Phone from "../components/Phone";
import icons from "../icons";

class Covid19StaticPage extends React.Component<{ mobileView: boolean }> {
    componentDidMount(): void {
        sendEvent({
            event: "categoryPageLoad",
            categoryName: "Covid-19",
            isTopical: true,
        });
        sendEvent({
            categoryName: undefined,
            isTopical: undefined,
        });
    }

    contactDetailPhone(number: string, comment: string | React.Node): React.Node {
        return (
            <div className="contact-detail phone">
                <icons.Phone />
                {
                    this.props.mobileView ? (
                        <a href={"tel:" + number}>{number}</a>
                    ) : <span>{number}</span>
                } ({comment})
            </div>
        )
    }
    contactDetailWeb(url: string, linkText: string | React.Node): React.Node {
        return (
            <div className="contact-detail web">
                <icons.Website />
                <a
                    href={url}
                    rel="noopener noreferer"
                    target="_blank"
                >
                    {linkText}
                </a>
            </div>
        )
    }
    render(): React.Node {
        return (
            <StaticPage
                title="COVID-19 Support"
                bannerName="money-help static"
                className="Covid19Page"
                bannerPrimary="Coronavirus disease 2019 (COVID-19) support"
                bannerSecondary={""}
            >
                <h2>
                    Coronavirus (COVID-19) information and services
                </h2>
                <p>
                    You can use Ask Izzy to{" "}
                    <Link to="/search/coronavirus/personalise">
                        find nearby clinics
                    </Link> providing services and testing specific to coronavirus.
                </p>

                <h2>
                    COVID-19 National Hotline
                </h2>
                <div>
                    The Coronavirus Health Information  Line provides general
                    information relating to coronavirus (COVID-19) for the
                    general community. The line operates 24 hours a day, seven
                    days a week.
                    <Phone
                        number="1800 020 080"
                        comment=""
                        kind=""
                    />
                </div>

                <div className="separator" />

                <h2>Federal Government Information</h2>
                <p>
                    For information from the federal government please visit
                    the{" "}
                    <a
                        href="https://www.health.gov.au/news/health-alerts/novel-coronavirus-2019-ncov-health-alert"
                        rel="noopener noreferer"
                        target="_blank"
                    >Australian Department of Health website</a> for the latest
                    medical advice, news and information.
                </p>

                <div className="separator" />
                <h2>State Government Information</h2>
                <h3>Victoria</h3>
                <ul>
                    <li>
                        {this.contactDetailPhone(
                            "1800 675 398",
                            "State coronavirus hotline"
                        )}
                    </li>
                    <li>
                        {this.contactDetailWeb(
                            "https://dhhs.vic.gov.au/coronavirus",
                            "Victorian Human Services coronavirus webpage"
                        )}
                    </li>
                </ul>

                <h3>New South Wales</h3>
                <ul>
                    <li>
                        {this.contactDetailPhone(
                            "1800 022 222",
                            "Healthdirect"
                        )}
                    </li>
                    <li>
                        {this.contactDetailWeb(
                            "https://www.nsw.gov.au/covid-19",
                            "NSW health coronavirus webpage"
                        )}
                    </li>
                </ul>

                <h3>Queensland</h3>
                <ul>
                    <li>
                        {this.contactDetailPhone(
                            "13 43 25 84",
                            "13 HEALTH - health advice for Queenslanders over the phone"
                        )}
                    </li>
                    <li>
                        {this.contactDetailWeb(
                            "https://www.qld.gov.au/health/conditions/health-alerts/coronavirus-covid-19",
                            "Queensland Health coronavirus webpage"
                        )}
                    </li>
                </ul>

                <h3>Western Australia</h3>
                <ul>
                    <li>
                        {this.contactDetailWeb(
                            "https://healthywa.wa.gov.au/coronavirus",
                            "WA Department of Health coronavirus webpage"
                        )}
                    </li>
                </ul>

                <h3>South Australia</h3>
                <ul>
                    <li>
                        {this.contactDetailWeb(
                            "https://www.sahealth.sa.gov.au/COVID2019",
                            "SA Health coronavirus webpage"
                        )}
                    </li>
                </ul>

                <h3>Tasmania</h3>
                <ul>
                    <li>
                        {this.contactDetailPhone(
                            "1800 671 738",
                            "Tasmanian Public Health Hotline"
                        )}
                    </li>
                    <li>
                        {this.contactDetailWeb(
                            "https://www.coronavirus.tas.gov.au/",
                            "Tasmanian Department of Health coronavirus webpage"
                        )}
                    </li>
                </ul>

                <h3>Australian Capital Territory</h3>
                <ul>
                    <li>
                        {this.contactDetailWeb(
                            "https://www.covid19.act.gov.au/",
                            "ACT Health coronavirus webpage"
                        )}
                    </li>
                </ul>

                <h3>Northern Territory</h3>
                <ul>
                    <li>
                        {this.contactDetailPhone(
                            "1800 008 002",
                            <span>NT Hotline <strong>for people who need to arrange testing only</strong></span>
                        )}
                    </li>
                    <li>
                        {this.contactDetailWeb(
                            "https://coronavirus.nt.gov.au/",
                            "NT Department of Health coronavirus webpage"
                        )}
                    </li>
                </ul>
            </StaticPage>
        );
    }
}

export default MobileDetect(Covid19StaticPage)
