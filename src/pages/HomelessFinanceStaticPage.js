/* @flow */
/* eslint-disable max-len */

import React from "react";
import { Link } from "react-router";
import StaticPage from "./StaticPage";

export default class HomelessFinanceStaticPage extends React.Component {
    render() {
        return (
            <StaticPage title="Homeless Finance">
                <h1>Homeless financial support</h1>
                <p>
                    If you have urgent money issues, are unable to pay your bills or need any other financial assistance, there are many homeless financial support services available to you.
                    To find support near you, search <Link to="/category/money-help">Ask Izzy's money help section</Link>.</p>
                <h2>What support is available?</h2>
                <p>There are many different free or low-cost services on offer to respond to your specific needs. Depending on your situation, the following help may be available to you:</p>
                <ul>
                <li>emergency aid</li>
                <li>bond or rental assistance</li>
                <li>assistance paying bills or buying food </li>
                <li>a no interest loans</li>
                <li>gambling or financial counselling</li>
                </ul>
                <h2>Dealing with debt</h2>
                <p>If you can't repay a debt by an agreed date, it is important to seek advice and take action as soon as possible. Unpaid debt may result in seizure of your property or a visit to court.</p>
                <p>You may feel pressured to make a decision or to agree to something when a creditor or debt collector contacts you. You have a right to get financial or legal information and advice before signing or agreeing to anything.</p>
                <p>It is important to remember that you also have the right to be protected from illegal behaviour from creditors and debt collectors. You have the right to:</p>
                <ul>
                <li>be treated fairly and not discriminated against</li>
                <li>have your privacy protected</li>
                <li>get help</li>
                <li>question the debt.</li>
                </ul>
                <h3><strong>Watch out for questionable offers of help</strong></h3>
                <p>Be careful of uninvited offers of help. Some organisations may offer to negotiate with your creditors and to restructure your debts for a fee. They usually write to you after you have been sued. </p>
                <p>Some of these organisations may be okay but others are not. Make sure you get advice from a financial counsellor before signing any contracts.</p>
                <h2>Where can I find homeless financial services?</h2>
                <p>There are financial services located in regional and metropolitan areas across Australia. Some are drop in services so you do not need to make an appointment and others are not. Check with your selected service before you travel. </p>
                <p><Link to="/category/money-help">Find financial help near you</Link> or browse:</p>
                <ul>
                    <li><Link to="/category/money-help/in/Adelaide-SA">Financial help in Adelaide</Link></li>
                    <li><Link to="/category/money-help/in/Brisbane-QLD">Financial help in Brisbane</Link></li>
                    <li><Link to="/category/money-help/in/Canberra-ACT">Financial help in Canberra</Link></li>
                    <li><Link to="/category/money-help/in/Darwin-NT">Financial help in Darwin</Link></li>
                    <li><Link to="/category/money-help/in/Melbourne-VIC">Financial help in Melbourne</Link></li>
                    <li><Link to="/category/money-help/in/Perth-WA">Financial help in Perth</Link></li>
                    <li><Link to="/category/money-help/in/Sydney-NSW">Financial help in Sydney</Link></li>
                </ul>

            </StaticPage>
        );
    }
}
