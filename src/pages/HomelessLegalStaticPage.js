/* @flow */
/* eslint-disable max-len */

import React from "react";
import Link from "../components/Link";
import StaticPage from "./StaticPage";

export default class HomelessLegalStaticPage extends React.Component<{}> {
    render() {
        return (
            <StaticPage
                title="Homeless Legal"
                bannerName="legal static"
            >
                <h1>Homeless legal services</h1>
                <p>
                    There are many free or low-cost legal services available for people experiencing, or at risk of, homelessness.
                    If you need legal advice or representation in court, <Link to="/">search Ask Izzy</Link> to find your closest legal centre.
                </p>
                <h2>What kind of legal help can I get?</h2>
                <p>Homeless legal centres provide free or low-cost, independent advice about the law and your specific situation. If you have a court date, they can prepare your case, represent you in the court appearance and help you through the legal process. </p>
                <p>
                    Typically legal centres specialise in either criminal or civil law
                    (see below for some examples of each).
                    If you are unsure if your issues are a criminal matter,
                    or if the centre near you offers the right support,
                    call them on the phone number listed in Ask Izzy.
                </p>
                <p>Many centres also offer translators if you need one. </p>
                <h2>Civil law</h2>
                <p>Lawyers working in civil law can help you with a range of problems, relating to disputes between private individuals and/or companies. Examples include:</p>
                <ul>
                    <li>housing and tenancy matters</li>
                    <li>guardianship and administration orders</li>
                    <li>credit and debt problems</li>
                </ul>
                <h2>Criminal law</h2>
                <p>Lawyers specialising in criminal law, can help you with issues relating to conduct prohibited by the government. Examples include:</p>
                <ul>
                    <li>fines and infringement notices </li>
                    <li>parole issues</li>
                    <li>prison and detention</li>
                </ul>
                <h2>Where can I find legal services for the homeless?</h2>
                <p>There are homeless legal service located in regional and metropolitan areas across Australia. Some are drop in services so you do not need to make an appointment and others are not. Check with your selected service before you travel. </p>
                <p><Link to="/">Find a legal service near you</Link> or browse:</p>
                <ul>
                    <li><Link to="/legal/Adelaide-SA">Legal service in Adelaide</Link></li>
                    <li><Link to="/legal/Brisbane-QLD">Legal service in Brisbane</Link></li>
                    <li><Link to="/legal/Canberra-ACT">Legal service in Canberra</Link></li>
                    <li><Link to="/legal/Darwin-NT">Legal service in Darwin</Link></li>
                    <li><Link to="/legal/Melbourne-VIC">Legal service in Melbourne</Link></li>
                    <li><Link to="/legal/Perth-WA">Legal service in Perth</Link></li>
                    <li><Link to="/legal/Sydney-NSW">Legal service in Sydney</Link></li>

                </ul>
            </StaticPage>
        );
    }
}
