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
                bannerName="drugs-alcohol"
            >
                <p>
                    When you’re looking for support, Ask Izzy can help you to find the services you need, right now and nearby. It is free and anonymous, and you can search over 350 000 services to find housing, meals, healthcare, counselling, legal advice, addiction treatment and a whole lot more.
                </p>
                <p>
                    If you’re on the Telstra mobile network, you can access Ask Izzy even if you don’t have credit.
                </p>
                <p>
                    We’re making improvements.
                </p>
                <p>
                    You might see some changes to the site over the coming months including a more welcoming design, improved Aboriginal and Torres Strait Islander service listings as well as the ability to find these services more easily. With help from the Victorian Government, we’re working to make Ask Izzy more inclusive for Aboriginal and Torres Strait Islander people.
                </p>
                <p>
                    We’re also making use of Ask Izzy’s anonymous data so service providers and policymakers can better match their offerings with need. In September, you’ll be able to compare data from the Australian Bureau of Statistics, Australian Institute of Health and Welfare and Ask Izzy, thanks to funding from Google.
                </p>

                <h3>Are you a service provider?</h3>
                <p>
                    Service information is constantly changing, so if you notice information that is not up to date you can
                    {' '}
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
                    Ask Izzy visit{' '}
                    <a href="https://www.infoxchange.net.au/ask-izzy">
                        Infoxchange’s website
                    </a>
                </p>
            </StaticPage>
        );
    }
}

export default AboutPage;
