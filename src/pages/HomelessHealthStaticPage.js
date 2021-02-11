/* @flow */
/* eslint-disable max-len */

import React from "react";
import Link from "../components/Link";
import StaticPage from "./StaticPage";

export default class HomelessHealthStaticPage extends React.Component<{}> {
    render() {
        return (
            <StaticPage
                title="Homeless Health"
                bannerName="health static"
            >
                <h1>Homeless health care</h1>
                <p>
                    If you are facing the prospect of homelessness
                    or are already experiencing homelessness, health
                    problems are often a fact of life. You may find
                    these health problems get worse or you are
                    troubled with new illnesses.
                </p>
                <p>
                    To manage your health issues there are many free
                    health clinics available. Some clinics are
                    scheduled at regular times, some are short-term
                    programs or events. To find a health clinic,
                    program or event near you <Link to="/health">
                    search Ask Izzy’s health section</Link>.
                </p>

                <h2>What kind of homeless health care is available?</h2>
                <p>Ask Izzy lists a range of health care options to respond to your needs. Health care available includes:</p>
                <ul>
                    <li>doctors and nurses</li>
                    <li>child health specialists</li>
                    <li>maternal and child health clinics</li>
                    <li>sexual health clinics</li>
                    <li>dentists</li>
                    <li>podiatrists for foot issues</li>
                    <li>mental or emotional help</li>
                    <li>hospitals</li>
                </ul>
                <p>
                    If you are in immediate need of medical assistance
                    please <Link to="tel:000">call an ambulance on 000</Link>
                </p>
                <h2>Are the services free?</h2>
                <p>Most services bulk bill and do not charge you any initial fees, however this depends on the clinic and if you have a serious condition you may need tests that incur additional costs. To check whether you will be charged, call the clinic on the number listed in Ask Izzy.</p>
                <p>
                    To receive bulk billing you will need a Medicare card.
                    If you do not have one, you can request one on via the {" "}
                    <Link
                        to={"https://www.humanservices.gov.au/customer/services/medicare/medicare-card"}
                    >
                        Department of Human Services
                    </Link>.
                </p>
                <h2>Where can I find homeless health care?</h2>
                <p>There are health care services for those experiencing homelessness located in regional and metropolitan areas across Australia. Some are drop in services so you do not need to make an appointment and others are not. Check with your selected service before you travel. </p>
                <p><Link to="/health">Find health care near you</Link> or browse:</p>
                <ul>
                    <li><Link to="/health/Adelaide-SA">Health care in Adelaide</Link></li>
                    <li><Link to="/health/Brisbane-QLD">Health care in Brisbane</Link></li>
                    <li><Link to="/health/Canberra-ACT">Health care in Canberra</Link></li>
                    <li><Link to="/health/Darwin-NT">Health care in Darwin</Link></li>
                    <li><Link to="/health/Melbourne-VIC">Health care in Melbourne</Link></li>
                    <li><Link to="/health/Perth-WA">Health care in Perth</Link></li>
                    <li><Link to="/health/Sydney-NSW">Health care in Sydney</Link></li>
                </ul>
            </StaticPage>
        );
    }
}
