/* @flow */
/* eslint-disable max-len */

import React from "react";
import { Link } from "react-router";
import components from "../components";

class AboutPage extends React.Component {
    props: {};
    state: void;

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    };

    render() {
        let back = () => this.context.router.goBack();

        return (
            <div className="AboutPage">
                <components.AppBar
                    title="About Ask Izzy"
                    onBackTouchTap={back}
                />

                <div className="body">
                    <p>
                        Ask Izzy helps people who are homeless
                        or at risk of becoming
                        homeless to find the services they need,
                        right now and nearby.
                    </p>

                    <h3>Ask Izzy</h3>
                    <ul>
                        <li>
                            Is Australia wide, free and anonymous
                        </li>
                        <li>
                            Can help you find housing, meals,
                            health services, counselling, legal help,
                            addiction help and a whole lot more services
                        </li>
                        <li>
                            Lists more than 350,000 different services
                        </li>
                        <li>
                            Is available on phones, tablets and computers
                        </li>
                    </ul>
                    <p>
                        For media enquiries or to find out more about
                        Ask Izzy visit{' '}
                        <a href="https://www.infoxchange.net.au/ask-izzy">
                            Infoxchange’s website
                        </a>
                    </p>

                    <h3>
                        Ask Izzy Service provider information
                    </h3>
                    <p>
                        Service information is constantly changing.
                        If you notice information that is not up to
                        date you can
                        {' '}
                        <a href="mailto:support@askizzy.org.au">
                            let us know directly
                        </a>.
                    </p>

                    <h4>
                        Adding your site or service
                    </h4>
                    <p>
                        You are able to add your service details to Ask Izzy by clicking the button below and providing the requested information. Information provided will be published on the Ask Izzy homelessness website and Infoxchange Service Seeker national directory. Please only provide information that you wish to be published. Please also note, correspondence for data maintenance purposes and updates regarding your listed service/s will be sent to your nominated contact email address.
                    </p>
                    <p>
                        If you provide a community support service and would like to list your service in Ask Izzy, take action now. It's easy and there is no cost involved.
                    </p>
                    <p>
                        <Link to="/add-service">
                            Add a new site / service
                        </Link>.
                    </p>


                    <h4>
                        Editing or removing your site or service
                    </h4>
                    <p>
                        If you need to make changes to your service details, or remove your service from the Ask Izzy homelessness website and Infoxchange Service Seeker national directory, please click 'Update/remove service' on the individual service listing and provide all of the requested information. The changes you request will be actioned within seven (7) calendar days from submission.
                    </p>

                    <h3>Supported by</h3>
                    <a href="https://www.infoxchange.net.au/ask-izzy"><h4>Infoxchange</h4></a>
                    <p>
                        Infoxchange has used technology to tackle our community’s biggest social challenges for over 25 years. We wanted to make it easier for people experiencing homelessness to find the services they need, when they need them, so we developed Ask Izzy in partnership with Google, REA Group and News Corp Australia.
                    </p>

                    <a href="https://www.google.org"><h4>Google</h4></a>
                    <p>
                        Google partners with organisations that see the potential of technology to have a scalable, positive impact on significant social issues. Infoxchange demonstrated this in spades and since our funding of Ask Izzy, our relationship has gone from strength to strength. We hope that the launch of Ask Izzy is just the first major milestone in a long and fruitful partnership.
                    </p>

                    <a href="http://www.rea-group.com"><h4>REA Group</h4></a>
                    <p>
                        REA Group, the company behind Australia’s number one property website realestate.com.au, exists to empower people by making the property process simple, efficient and stress free. That’s why our social mission is focused on homelessness in Australia, because we believe everyone should have a safe place to sleep - every night.
                    </p>

                    <a href="http://www.newscorpaustralia.com"><h4>News Corp Australia</h4></a>
                    <p>
                        News Corp’s mission is to inspire, inform and advocate for a better Australia, which is why we are collaborating with REA Group, Google and Infoxchange on Ask Izzy. Each day we reach 7.1 million Australians through our newspapers and websites. We have an important role in communicating the value and existence of this critical social tool that will benefit the vulnerable in our society.
                    </p>

                    <p className="acknowledgement">
                        We acknowledge the traditional custodians of this
                        land and pay our respects to their culture, their
                        people and elders past and present.
                    </p>
                </div>
            </div>
        );
    }

}

export default AboutPage;
