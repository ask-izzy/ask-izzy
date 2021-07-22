/* @flow */
import type {Node} from "React";/* eslint-disable max-len */

import React from "react";
import StaticPage from "./StaticPage";
import OnlineSafetyContent from "../components/OnlineSafetyContent";

export default class OnlineSafetyStaticPage extends React.Component<{}, void> {
    render(): Node {
        return (
            <StaticPage
                title="Online Safety"
                bannerName="family-violence static"
            >
                <OnlineSafetyContent />
            </StaticPage>
        );
    }
}
