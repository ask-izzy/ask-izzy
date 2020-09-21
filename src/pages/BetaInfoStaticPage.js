/* @flow */
/* eslint-disable max-len */

import React from "react";
import StaticPage from "./StaticPage";
import components from "../components";
import routerContext from "../contexts/router-context";

export default class BetaInfoStaticPage extends React.Component<{}, void> {
    static contextType = routerContext;

    render() {
        return (
            <StaticPage
                title=""
                bannerPrimary="About Ask Izzy Beta"
                bannerName="technology static"
                className="BetaInfoPage"
            >
                <h1>Draft Text</h1>
                <h2>About “Ask Izzy Beta”</h2>
                <p>
                    We’re working hard to improve Ask Izzy, and to help with this, we’ve set up an Ask Izzy “Beta”. The Beta is a place where we can try new things and get feedback from the people that use Ask Izzy, without worrying about breaking the “regular” Ask Izzy
                </p>
                <p>Ask Izzy Beta still connects to the same services that regular Ask Izzy does, and should be familiar to anyone that uses Ask Izzy. It will however contain new and experimental features, and you might notice some screens start to look different. Ask Izzy Beta lives at beta.askizzy.org.au, regular Ask Izzy will remain at Askizzy.org.au. </p>
                <p>
                    To help us build a better Ask Izzy, we’d love for people to use our Beta, and tell us what they think. At the moment, our Beta experience is mostly built around helping those experiencing disadvantage or vulnerability due to the COVID-19 Pandemic. It offers more guided support around things like housing, money, and mental health. If this sounds interesting to you or the people you are supporting, please feel free to <a href="https://beta.askizzy.org.au">give it a go</a>.
                </p>
                <h2>Things you should know before using Beta</h2>
                <p>
                    We don’t recommend you use the Beta if you are in a crisis or emergency situation.
                </p>
                <p>
                    The beta might be a bit more 'rough around the edges', you might find things that don’t work properly (please let us know! [link]) and we may monitor and measure it more closely than we do with regular Ask Izzy. Although we will never capture any personally identifiable information about you, we may use tools to measure what pages and parts of Ask Izzy people are using, and how people move through Ask Izzy.
                </p>
                <p>
                    Participating in our beta is entirely voluntary, and you can return to regular Ask Izzy whenever you like. By taking part you’ll be helping us to build a better app, and will have the opportunity to see, and give feedback on, features as they emerge.
                </p>
                <div className="buttonsBox">
                    <components.FlatButton
                        label="Not interested in the Beta"
                        onClick={this.context.router.history.goBack}
                    />
                    <a href="https://beta.askizzy.org.au">
                        <components.FlatButton
                            className="goToBeta"
                            label="Take me to the Beta"
                            onClick={() => {}}
                        />
                    </a>
                </div>
            </StaticPage>
        );
    }
}
