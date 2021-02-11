/* @flow */
/* eslint-disable max-len */

import React from "react";

import Link from "../components/Link";
import StaticPage from "./StaticPage";
import config from "../config";

class AboutPage extends React.Component<{}, void> {

    render() {

        return (
            <StaticPage
                title="About Ask Izzy"
                bannerName="drugs-alcohol static"
            >
                <div className="AboutPage">
                    <p>
                        Ask Izzy is a website that connects people in need with
                        housing, a meal, money help, family violence support,
                        counselling and much more.
                    </p>
                    <p>
                        It is free and anonymous, with over 370,000 services
                        listed across Australia.
                    </p>
                    <p>
                        And if you're on the Telstra or Vodafone mobile
                        networks, you can access Ask Izzy on your phone even if
                        you don't have credit or access to wifi.
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
                        <Link
                            to="https://opendata.askizzy.org.au"
                            target="_blank"
                        >
                            Ask Izzy Open Data Platform
                        </Link>. Using anonymous data from Ask Izzy, the Australian
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
                        <Link
                            to="https://infoxchange.us7.list-manage.com/subscribe?u=a6c9f2847322bb43e66d8e483&id=74aeba2755"
                            target="_blank"
                        >
                            Ask Izzy quarterly newsletter
                        </Link>
                        {" "}
                        and follow us on
                        {" "}
                        <Link
                            to="https://www.facebook.com/askizzyau/"
                            target="_blank"
                        >
                            Facebook
                        </Link>.
                    </p>

                    <h3>Are you a service provider?</h3>
                    <p>
                        Service information is constantly changing, so if you
                        notice information that is not up to date you can
                        {" "}
                        <Link to={`mailto:${config.default.siteMail}`}>
                            let us know directly
                        </Link>.
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
                        <Link to="https://infoxchange.serviceseeker.com.au">
                            Service Seeker
                        </Link>.
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
                    <p>
                        <img src="/static/images/logo-powered-by-ix.svg"
                            className="powered-by-ix img-center"
                            alt="Ask Izzy is powered by Infoxchange"
                            title="Ask Izzy is powered by Infoxchange"
                        />
                    </p>
                    <h4 className="text-center h4-founding-partners">Founding partners</h4>
                    <p>
                        <img src="/static/images/logo-four-founding-partners.svg"
                            alt="Infoxchange, Google, realestate.com.au and News Corp Australia logos"
                            title="Infoxchange, Google, realestate.com.au and News Corp Australia logos"
                        />
                    </p>
                    <p className="small text-center">Ask Izzy was developed by <Link to="https://www.infoxchange.org">Infoxchange</Link> in partnership with <Link to="https://google.org">Google</Link>, <Link to="https://www.realestate.com.au">realestate.com.au</Link> and <Link to="https://www.newscorpaustralia.com">News Corp Australia</Link>.</p>
                    <h4 className="h4-ctb-partners text-center">Contributing partners</h4>
                    <p>
                        <img src="/static/images/logo-four-ctb-partners.svg"
                            alt="NAB Foundation, Telstra Foundation, Victorian Government and Vodafone Foundation logos"
                            title="NAB Foundation, Telstra Foundation, Victorian Government and Vodafone Foundation logos"
                        />
                    </p>
                </div>
            </StaticPage>
        );
    }
}

export default AboutPage;
