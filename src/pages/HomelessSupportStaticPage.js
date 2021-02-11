/* @flow */
/* eslint-disable max-len */

import React from "react";
import Link from "../components/Link";
import StaticPage from "./StaticPage";

export default class HomelessSupportStaticPage extends React.Component<{}> {
    render() {
        return (
            <StaticPage
                title="Homeless Support"
                bannerName="support-counselling static"
            >
                <h1>Homeless support</h1>
                <p>
                    The support available to people experiencing homelessness extends not only to
                    those sleeping rough, but to anyone without permanent housing. This includes
                    people who are couch surfing, staying in temporary accommodation, have no fixed
                    address and in long-term hostels and shelters.
                </p>
                <p>
                    If you are in any of these situations you may be looking for different kinds of
                    help — from a bed for the night to help finding work. You can find a range of
                    support services near you on <Link to="/">Ask Izzy</Link>.
                </p>

                <h2>What support services are listed in Ask Izzy?</h2>
                <p>Ask Izzy lists the following support services:</p>
                <ul>
                    <li>Housing: find a bed for the night, including crisis accommodation and short term stays. </li>
                    <li>Food: get groceries at a food bank or find a meal service near you</li>
                    <li>Everyday things: find out where to get a swag, clothes, food vouchers and more.</li>
                    <li>Health: search a range of health services, from your local GP or dentist to mental and emotional counselling.</li>
                    <li>Centrelink: make an appointment at your local Centrelink or apply for an allowance.</li>
                    <li>Money help: get emergency aid, debt help or financial counselling.</li>
                    <li>Support and counselling: find someone to talk to about your issues.</li>
                    <li>Legal help: get help responding to fines, dealing with police and legal information about your situation.</li>
                    <li>Drug and alcohol support: search counselling and rehabilitation services near you.</li>
                    <li>Life skills and education: want to start a course? Find the right one for you.</li>
                    <li>Help finding work: search employment service and volunteering opportunities</li>
                    <li>Location of facilities: find the nearest public toilets, libraries and more. </li>
                    <li>Something to do near you: search local events.</li>
                    <li>Technology assistance: charge your phone, find free wifi and more.</li>
                </ul>

                <h2>Where can I find support?</h2>
                <p>
                    Ask Izzy lists over 340 000 support services in regional and metropolitan
                    areas across Australia. <Link to="/">Find support services near you</Link> or browse:</p>
                <ul>
                    <li><Link to="/support-counselling/Adelaide-SA">Support services in Adelaide</Link></li>
                    <li><Link to="/support-counselling/Brisbane-QLD">Support services in Brisbane</Link></li>
                    <li><Link to="/support-counselling/Canberra-ACT">Support services in Canberra</Link></li>
                    <li><Link to="/support-counselling/Darwin-NT">Support services in Darwin</Link></li>
                    <li><Link to="/support-counselling/Melbourne-VIC">Support services in Melbourne</Link></li>
                    <li><Link to="/support-counselling/Perth-WA">Support services in Perth</Link></li>
                    <li><Link to="/support-counselling/Sydney-NSW">Support services in Sydney</Link></li>
                </ul>
            </StaticPage>
        );
    }
}
