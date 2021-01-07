/* @flow */
/* eslint-disable max-len */

import React from "react";
import { Link } from "react-router-dom";
import StaticPage from "./StaticPage";
import FlatButton from "../components/FlatButton";

class DisabilityAdvocacyFinder extends React.Component<{}, void> {

    render() {

        return (
            <StaticPage
                title="Disability advocacy"
                bannerPrimary="Disability Advocacy"
                bannerSecondary="Find advocacy services near you"
                bannerName="advocacy static"
            >
                <div className="DisabilityAdvocacyFinder">
                    <h2>Ask Izzy - Disability Advocacy Finder</h2>
                    <p>
                        From this page you can search for Disability Advocacy
                        providers in your area. These services are intended to
                        provide people with disability with access to
                        independent advocacy that promotes, protects and ensures
                        their full and equal enjoyment of all human rights.
                    </p>
                    <Link
                        to="/search/Disability Advocacy Providers"
                        className="findAdvocacyButton"
                    >
                        <FlatButton
                            label="Find advocacy"
                            onClick={() => {}}
                        />
                    </Link>
                    <p>
                        <strong>For more information about disability advocacy</strong>
                        <br />
                        <a
                            href="https://disabilityadvocacyfinder.dss.gov.au/disability/ndap/about"
                            target="_blank"
                        >
                            See the Department of Social Services website
                        </a>
                    </p>
                    <h3>Other Ask Izzy Services</h3>
                    <p>
                        Ask Izzy is a website that connects people in need with
                        housing, a meal, money help, family violence support,
                        counselling and much more.
                    </p>
                    <p>
                        It is free and anonymous, with over 370,000 services listed across Australia.
                    </p>
                    <p>
                        <Link
                            to="/"
                        >
                            See what support Ask Izzy can offer.
                        </Link>
                    </p>
                </div>
            </StaticPage>
        );
    }
}

export default DisabilityAdvocacyFinder;
