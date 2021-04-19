/* @flow */
/* eslint-disable max-len */

import React from "react";
import { Link } from "react-router-dom";
import StaticPage from "./StaticPage";

export default class HomelessSheltersStaticPage extends React.Component<{}> {
    render() {
        return (
            <StaticPage
                title="Homeless Shelters"
                bannerName="centrelink static"
            >
                <h2>Homeless Shelters</h2>
                <p>
                If there are significant issues impacting your life, such as legal, family,
                drug and alcohol, and longer term housing needs, you may be faced with
                having to find crisis or urgent short term accommodation.
                </p>
                <p>
                Ask Izzy lists specialist housing services that can help you access homeless
                shelters. To find services near you, <Link to="/">search Ask Izzy</Link> now.
                </p>

                <h3>How do I get a bed?</h3>

                <p>
                Whilst there are many homeless shelters across Australia you will usually need
                to talk with a specialist homeless service to help you stay safe, find
                accommodation, secure support services and get practical assistance while sorting
                out shelter or housing.
                </p>
                <p>
                If you are unsure what to do next, call the specialist homeless services on
                the phone number listed in Ask Izzy and they will try to will help you.
                </p>

                <h3>How do I know which shelter to go to?</h3>

                <p>
                There are a range of different shelters and housing options and many cater for
                specific groups, such as
                </p>

                <ul>
                    <li>women fleeing family violence</li>
                    <li>families</li>
                    <li>young people</li>
                    <li>Indigenous people</li>
                    <li>people seeking asylum</li>
                    <li>people with disabilities</li>
                </ul>

                <p>
                Ask Izzy lists a homelessness crisis number for each state and the specialist
                homeless services near you. Contact them to confirm eligibility and arrange
                access to the homeless shelter.
                </p>
                <p>
                Through answering a few simple questions, Ask Izzy can find the most suitable
                specialist homeless service for you in your area.
                Your answers are private and no personal information is collected.
                Anonymous data is collected via Google Analytics to help us understand what people are searching for.
                    {" "}<Link to="/housing">Search Ask Izzy for housing</Link>.
                </p>

                <h3>What help do they offer?</h3>

                <p>
                Most homeless shelters provide meals and low-cost board.
                Some have staff available 24 hours a day.
                </p>
                <p>
                You will be assigned a case manager who will assist you with
                the issues that you are dealing with.
                They can help you get the things you need by connecting you with relevant services. These things may include:
                </p>

                <ul>
                    <li>clothes, food vouchers and other everyday things</li>
                    <li>health advice (physical, mental and emotional)</li>
                    <li>Centrelink payments</li>
                    <li>money help</li>
                    <li>support and counselling</li>
                    <li>legal advice</li>
                    <li>drug and alcohol support</li>
                    <li>life skills and education</li>
                    <li>employment</li>
                </ul>

                <h3>Where can I find a homeless shelter?</h3>

                <p>
                There are homeless shelters across the country,
                in regional and metropolitan areas. {" "}
                    <Link to={{pathname: "/housing", state: {
                        "shs": true,
                    }}}
                    >
                  Find a specialist homeless service
                    </Link> who can help you access shelter near you or browse:
                </p>

                <ul>
                    {
                        // This uses /search instead of /category
                        // so that search engines can index the results
                    }
                    <li><Link to="/search/housing/Adelaide-SA">housing in Adelaide</Link></li>
                    <li><Link to="/search/housing/Brisbane-QLD">housing in Brisbane</Link></li>
                    <li><Link to="/search/housing/Canberra-ACT">housing in Canberra</Link></li>
                    <li><Link to="/search/housing/Darwin-NT">housing in Darwin</Link></li>
                    <li><Link to="/search/housing/Melbourne-VIC">housing in Melbourne</Link></li>
                    <li><Link to="/search/housing/Perth-WA">housing in Perth</Link></li>
                    <li><Link to="/search/housing/Sydney-NSW">housing in Sydney</Link></li>
                </ul>
            </StaticPage>
        );
    }
}
