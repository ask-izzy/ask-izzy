/* @flow */
/* eslint-disable max-len */

import React from "react";
import type {Node as ReactNode} from "React";
import StaticPage from "./StaticPage";
import OnlineSafetyContent from "../components/OnlineSafetyContent";

export default class OnlineSafetyStaticPage extends React.Component<{}, void> {
    render(): ReactNode {
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
