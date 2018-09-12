/* @flow */
/* eslint-disable max-len */

import React from "react";
import StaticPage from "./StaticPage";

export default class InformationPage extends React.Component<{}> {
    render() {
        const link1800Respect = "https://www.1800respect.org.au";

        return (
            <StaticPage
                title="Information"
                bannerName="family-violence static"
            >
                <p><strong>Violence or abuse is not your fault. Everyone has the right to be safe.</strong></p>
                <p><strong>Anyone can experience domestic and family violence or abuse.</strong></p>
                <p>Domestic and family violence is when someone is controlling or hurting you.</p>
                <p>This can include one or more:</p>
                <ul>
                    <li>Emotional - Putting you down, yelling and swearing, making threats and scaring you.</li>
                    <li>Financial - controlling money, stops you using your money, or stealing your money.</li>
                    <li>Physical - pushing, shoving, kicking, slapping or threatening to do those things.</li>
                    <li>Sexual - touching or doing things you don’t want them to do.</li>
                    <li>Stalking - following you or tracking you with calls, texts and other devices.</li>
                </ul>
                <p>All types of violence are serious.</p>
                <p>Many people who experience domestic violence will never experience physical violence.</p>
                <p>You might be experiencing domestic and family violence or abuse if...</p>
                <ul>
                    <li>Scared and frightened of the person (even sometimes)?</li>
                    <li>Feel like you never know what will 'set them off'?</li>
                    <li>That you are 'walking on eggshells'?</li>
                    <li>Says you are not a good person or worthless</li>
                    <li>Says or does hurt you, your children or animals</li>
                </ul>
                <p>Help is available now - Advice, choices and safety.</p>
                <p>Call <a href={link1800Respect}>1800Respect</a>.</p>
                <p>Or look at the services and legal help available.</p>
            </StaticPage>
        );
    }
}
