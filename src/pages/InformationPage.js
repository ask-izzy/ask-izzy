/* @flow */
/* eslint-disable max-len */

import React from "react";
import StaticPage from "./StaticPage";
import Link from "../components/Link";

export default class InformationPage extends React.Component<{}> {
    render() {
        const link1800Respect = "https://www.1800respect.org.au";

        return (
            <StaticPage
                title="Information"
                bannerName="family-violence static"
            >
                <div className="InformationPage">
                    <h2>Violence or abuse is not your fault. Everyone has the right to be safe.</h2>
                    <h2>Anyone can experience domestic and family violence or abuse.</h2>
                    <p>Domestic and family violence is when someone is controlling or hurting you.</p>
                    <p>This can include one or more:</p>
                    <ul>
                        <li>Emotional - Putting you down, yelling and swearing, making threats and scaring you.</li>
                        <li>Financial - controlling money, stops you using your money, or stealing your money.</li>
                        <li>Physical - pushing, shoving, kicking, slapping or threatening to do those things.</li>
                        <li>Sexual - touching or doing things you don’t want them to do.</li>
                        <li>Stalking - following you or tracking you with calls, texts and other devices.</li>
                    </ul>
                    <p>All types of violence are serious. Many people who experience domestic violence will never experience physical violence.</p>
                    <p>It can be done by:</p>
                    <ul>
                        <li>Your partner / husband / wife / boyfriend / girlfriend</li>
                        <li>Your ex partner / husband / wife / boyfriend / girlfriend</li>
                        <li>Your LGBTIQA+ relationships</li>
                        <li>Your family member, kin, or someone like a family member</li>
                        <li>A carer like a support worker</li>
                    </ul>
                    <p>Warnings signs that you are experiencing domestic and family violence:</p>
                    <ul>
                        <li>Feeling scared and frightened of the person (even sometimes)?</li>
                        <li>Feeling like you are 'walking on eggshells'?</li>
                        <li>Feeling like you never know what will 'set them off'?</li>
                        <li>The person says you are not a good person or worthless.</li>
                        <li>The person says they will or does hurt you, your children or animals.</li>
                    </ul>
                    <p>Help is available now - Advice, choices and safety.</p>
                    <p>Call <Link to={link1800Respect}>1800Respect</Link>.</p>
                    <p>Or look at the services and legal help available.</p>
                </div>
            </StaticPage>
        );
    }
}
