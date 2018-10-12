/* @flow */
/* eslint-disable max-len */

import React from "react";
import PropTypes from "proptypes";
import { Link } from "react-router";
import StaticPage from "./StaticPage";
import config from "../config";

class AboutPage extends React.Component<{}, void> {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    render() {
        return (
            <StaticPage
                title="About Ask Izzy"
                bannerName="drugs-alcohol static"
            >
                <p>
                    When you’re looking for support, Ask Izzy can help you to
                    find the services you need, right now and nearby. It is free
                    and anonymous, and you can search over 350 000 services to
                    find housing, meals, healthcare, counselling, legal advice,
                    addiction treatment and a whole lot more.
                </p>
                <p>
                    If you’re on the Telstra mobile network, you can access Ask
                    Izzy even if you don’t have credit.
                </p>
                <p>
                    We’re making improvements.
                </p>
                <p>
                    You might have seen some changes to the site recently
                    including a more welcoming design, improved Aboriginal and
                    Torres Strait Islander service listings as well as the
                    ability to find these services more easily. With help from
                    the Victorian Government, we've made improvements to make
                    Ask Izzy more inclusive for Aboriginal and Torres Strait
                    Islander people.
                </p>
                <p>
                    With the support of Google, Infoxchange has also developed
                    the{" "}
                    <a
                        href="https://opendata.askizzy.org.au"
                        target="_blank"
                    >
                        Ask Izzy Open Data Platform
                    </a>. Using anonymous data from Ask Izzy, the Australian
                    Bureau of Statistics and Australian Institute of Health and
                    Welfare, the Ask Izzy Open Data Platform provides insights
                    into the supply and demand of services across Australia such
                    as housing, food, health and more.
                </p>
                <p>
                    To keep up-to-date with the latest Ask Izzy stories,
                    projects, events and upcoming launches, sign up to our{" "}
                    <a href="http://eepurl.com/c79CV1">Ask Izzy Updates</a>{" "}
                    quarterly enewsletter and follow us on{" "}
                    <a
                        href="https://www.facebook.com/askizzyau/"
                        target="_blank"
                    >
                        Facebook
                    </a>.
                </p>

                <h3>Are you a service provider?</h3>
                <p>
                    Service information is constantly changing, so if you notice information that is not up to date you can
                    {" "}
                    <a href={"mailto:" + config.default.siteMail}>
                        let us know directly
                    </a>.
                </p>
                <p>
                    If your site or service isn’t listed, you can add it through our simple online form.
                </p>
                <p>
                    The information you provide will be published on Ask Izzy and its sister directory, <a href="https://infoxchange.serviceseeker.com.au">Service Seeker</a>.
                </p>
                <p>
                    Please provide information that you wish to be public and an email address on which we can contact you for data maintenance purposes.
                </p>
                <p>
                    <Link to="/add-service">
                        Add your new site or service.
                    </Link>
                </p>
                <p>
                    If you already have a listing you can edit or remove it by clicking 'Update/remove service' on your  listing. The changes you request will be actioned within a week.
                </p>

                <h3>Ask Izzy is proudly supported by...</h3>
                <a href="https://www.infoxchange.net.au/ask-izzy"><h4>Infoxchange</h4></a>
                <p>
                    Infoxchange has used technology to tackle our community’s biggest social challenges for over 26 years. We wanted to make it easier for people to find the services they need, when they need them, so we developed Ask Izzy in partnership with Google, REA Group and News Corp Australia.
                </p>

                <a href="https://www.google.org"><h4>Google</h4></a>
                <p>
                    Google partners with organisations that see the potential of technology to have a scalable, positive impact on significant social issues.
                </p>

                <a href="http://www.rea-group.com"><h4>REA Group</h4></a>
                <p>
                    REA Group, the company behind Australia’s number one property website realestate.com.au, believes everyone should have a safe place to sleep - every night.
                </p>

                <a href="http://www.newscorpaustralia.com"><h4>News Corp Australia</h4></a>
                <p>
                    News Corp’s mission is to inspire, inform and advocate for a better Australia.
                </p>

                <br />
                <p>
                    For media enquiries or to find out more about
                    Ask Izzy visit{" "}
                    <a href="https://www.infoxchange.net.au/ask-izzy">
                        Infoxchange’s website
                    </a>
                </p>
            </StaticPage>
        );
    }
}

export default AboutPage;
