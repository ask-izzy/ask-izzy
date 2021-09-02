/* @flow */
/* eslint-disable max-len */

import React from "react";
import type {Node as ReactNode} from "react";
import StaticPage from "./StaticPage";
import components from "../components";
import icons from "../icons";
import routerContext from "../contexts/router-context";

export default class BetaInfoStaticPage extends React.Component<{}, void> {
    static contextType: any = routerContext;

    render(): ReactNode {
        return (
            <StaticPage
                title=""
                bannerPrimary="About Ask Izzy Beta"
                bannerName="technology static"
                className="BetaInfoPage"
            >
                <h2>About “Ask Izzy Beta”</h2>
                <p>
                    We’re working hard to improve Ask Izzy, and to help with this, we’ve set up an Ask Izzy “Beta”. The Beta is a place where we can try new things and get feedback from the people that use Ask Izzy, without worrying about breaking the “regular” Ask Izzy
                </p>
                <p>Ask Izzy Beta still connects to the same services that regular Ask Izzy does, and should be familiar to anyone that uses Ask Izzy. It will however contain new and experimental features, and you might notice some screens start to look different. Ask Izzy Beta lives at beta.askizzy.org.au, regular Ask Izzy will remain at Askizzy.org.au. </p>
                <h3>Ask Izzy Beta  v1.0 – Pandemic support</h3>
                <p>
                    To help us build a better Ask Izzy, we’d love for people to use our Beta, and tell us what they think. At the moment, our Beta experience is mostly built around helping those experiencing disadvantage or vulnerability due to the COVID-19 Pandemic. It offers more guided support around things like housing, money, and mental health.
                </p>
                <h2>Things you should know before using Beta</h2>
                <p>
                    We don’t recommend you use the Beta if you are in a crisis or emergency situation.
                </p>
                <p>
                    The beta might be a bit more 'rough around the edges', you might find things that don’t work properly
                    (<a href={"mailto:support@askizzy.org.au?subject=Ask%20Izzy%20Beta%20-%20Feedback"}>please let us know!</a>)
                    and we may monitor and measure it more closely than we do with regular Ask Izzy. Although we will
                    never capture any personally identifiable information about you, we may use tools to measure what pages
                    and parts of Ask Izzy people are using, and how people move through Ask Izzy.
                </p>
                <p>
                    Participating in our beta is entirely voluntary, and you can return to regular Ask Izzy whenever you like. By taking part you’ll be helping us to build a better app, and will have the opportunity to see, and give feedback on, features as they emerge.
                </p>
                <div className="buttonsBox">
                    <components.FlatButton
                        label="Continue using Beta"
                        onClick={() => this.context.router.navigate("/")}
                    />

                    <div className="returnToProd">
                        <a href="https://askizzy.org.au">
                            <icons.ChevronBack />
                            <span>Return to AskIzzy.org.au</span>
                        </a>
                    </div>
                </div>
            </StaticPage>
        );
    }
}
