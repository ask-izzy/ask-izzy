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
                    find the services you need, now and nearby. It is free and
                    anonymous, and you can search over 360,000 services to find
                    housing, meals, healthcare, counselling, legal advice,
                    addiction treatment and a whole lot more.
                </p>
                <p>
                    If you’re on the Telstra mobile network, you can access Ask
                    Izzy even if you don’t have credit.
                </p>
                <h3>
                    We’re always making improvements.
                </h3>
                <p>
                    <strong>March 2019 Update</strong>
                </p>
                <p>
                    With help from the NAB Foundation, we enhanced Ask Izzy to
                    make it easier and safer for people experiencing family
                    violence to find the help they need. Updates included:
                </p>
                <ul>
                    <li>
                        A new domestic and family violence search category and
                        multiple pathways to family violence services
                    </li>
                    <li>
                        Safety screening questions to identify people who may
                        be in danger
                    </li>
                    <li>
                        Best practice technology safety tips and warnings for
                        users
                    </li>
                </ul>
                <p>
                    <strong>August 2018 Update</strong>
                </p>
                <p>
                    With the support of Google, Infoxchange developed the
                    {" "}
                    <a
                        href="https://opendata.askizzy.org.au"
                        target="_blank"
                    >
                        Ask Izzy Open Data Platform
                    </a>. Using anonymous data from Ask Izzy, the Australian
                    Bureau of Statistics and Australian Institute of Health and
                    Welfare, the Ask Izzy Open Data Platform provides insights
                    into the supply and demand of services across Australia
                    such as housing, food, health and more.
                </p>
                <p>
                    <strong>November 2017</strong>
                </p>
                <p>
                    With help from the Victorian Government, we made
                    improvements to make Ask Izzy more inclusive for Aboriginal
                    and Torres Strait Islander people. Updates included a more
                    welcoming design, improved Aboriginal and Torres Strait
                    Islander service listings and the ability to find these
                    services more easily.
                </p>
                <p>
                    To keep up-to-date with the latest Ask Izzy news, sign up
                    to our
                    {" "}
                    <a
                        href="https://infoxchange.us7.list-manage.com/subscribe?u=a6c9f2847322bb43e66d8e483&id=74aeba2755"
                        target="_blank"
                    >
                        Ask Izzy quarterly newsletter
                    </a>
                    {" "}
                    and follow us on
                    {" "}
                    <a
                        href="https://www.facebook.com/askizzyau/"
                        target="_blank"
                    >
                        Facebook
                    </a>.
                </p>

                <h3>Are you a service provider?</h3>
                <p>
                    Service information is constantly changing, so if you
                    notice information that is not up to date you can
                    {" "}
                    <a href={`mailto:${config.default.siteMail}`}>
                        let us know directly
                    </a>.
                </p>
                <p>
                    If your site or service isn’t listed, you can add it
                    through our
                    {" "}
                    <Link to="/add-service">
                        simple online form
                    </Link>.
                </p>
                <p>
                    The information you provide will be published on Ask Izzy
                    and its sister directory,
                    {" "}
                    <a href="https://infoxchange.serviceseeker.com.au">
                        Service Seeker
                    </a>.
                </p>
                <p>
                    Please provide information that you wish to be public and
                    an email address at which we can contact you for data
                    maintenance purposes.
                </p>
                <p>
                    If you already have a listing you can edit or remove it by
                    clicking 'Update/remove service' on your  listing. The
                    changes you request will be actioned within a week.
                </p>

                <h3>Ask Izzy is proudly supported by...</h3>
                <a href="https://www.infoxchange.net.au/ask-izzy">
                    <h4>Infoxchange</h4>
                </a>
                <p>
                    Infoxchange has used technology to tackle our community’s
                    biggest social challenges for 30 years. We wanted to make
                    it easier for people to find the services they need, when
                    they need them, so we developed Ask Izzy in partnership
                    with Google, REA Group and News Corp Australia.
                </p>

                <a href="https://www.google.org">
                    <h4>Google</h4>
                </a>
                <p>
                    Google partners with organisations that see the potential
                    of technology to have a scalable, positive impact on
                    significant social issues.
                </p>

                <a href="http://www.rea-group.com">
                    <h4>REA Group</h4>
                </a>
                <p>
                    REA Group, the company behind Australia’s number one
                    property website realestate.com.au, believes everyone
                    should have a safe place to sleep - every night.
                </p>

                <a href="http://www.newscorpaustralia.com">
                    <h4>News Corp Australia</h4>
                </a>
                <p>
                    News Corp’s mission is to inspire, inform and advocate for
                    a better Australia.
                </p>

                <br />
                <p>
                    For media enquiries or to find out more about
                    Ask Izzy visit
                    {" "}
                    <a href="https://www.infoxchange.net.au/ask-izzy">
                        Infoxchange’s website
                    </a>.
                </p>
            </StaticPage>
        );
    }
}

export default AboutPage;
