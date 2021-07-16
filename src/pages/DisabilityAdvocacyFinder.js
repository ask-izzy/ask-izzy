/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import Link from "../components/Link";
import StaticPage from "./StaticPage";
import FlatButton from "../components/FlatButton";

class DisabilityAdvocacyFinder extends React.Component<{}, void> {
    render(): ReactNode {
        return (
            <StaticPage
                bannerPrimary="Disability Advocacy"
                bannerSecondary="Find advocacy services near you"
                bannerName="advocacy static"
            >
                <div className="DisabilityAdvocacyFinder">
                    <h2>Using Ask Izzy to find a Disability Advocate</h2>
                    <p>
                        People with disability who need someone to speak up for
                        them can use Ask Izzy to search for independent
                        Disability Advocacy providers in their area. These
                        services provide access to professionals who can ensure
                        the choices and rights of people with disability are
                        respected and they are being treated fairly.
                    </p>
                    <Link
                        to="/search/Disability Advocacy Providers"
                        className="findAdvocacyButton"
                    >
                        <FlatButton
                            label="Find an advocate on Ask Izzy"
                            onClick={() => {}}
                        />
                    </Link>
                    <div>
                        <h3>
                            Want more information about disability advocacy?
                        </h3>
                        <Link
                            to={"https://disabilityadvocacyfinder.dss.gov." +
                                "au/disability/ndap/about"}
                        >
                            See the Department of Social Services website
                        </Link>
                    </div>
                    <div className="askIzzyInfoBox">
                        <h2>Other support services on Ask Izzy</h2>
                        <p>
                            Ask Izzy is a website that connects people in need
                            with housing, a meal, money help, family violence
                            support, counselling and much more.
                        </p>
                        <p>
                            It is free and anonymous, with over 370,000 services
                            listed across Australia.
                        </p>
                        <p>
                            <Link
                                to="/"
                            >
                                Search Ask Izzy for support now.
                            </Link>
                        </p>
                    </div>
                </div>
            </StaticPage>
        );
    }
}

export default DisabilityAdvocacyFinder;
