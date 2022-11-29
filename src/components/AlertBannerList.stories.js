/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";

import AlertBannerList from "./AlertBannerList";
import alertsQuery from "@/queries/content/alerts.js";
import {
    resultsPageAlerts,
} from "../../test/support/mock-cms/resolvers/alerts.js"

export default {
    title: "App Components/AlertBanner/AlertBannerList",
    component: AlertBannerList,
};

const resultsPageApolloClient = {
    mocks: [
        {
            request: {
                query: alertsQuery,
            },
            result: {
                data: {
                    alerts: resultsPageAlerts,
                },
            },
        },
    ],
}

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <AlertBannerList {...args} />;
};

export const ThreeBanners: typeof Template = Template.bind({});
ThreeBanners.parameters = {
    apolloClient: resultsPageApolloClient,
};

export const InlineStyle: typeof Template = Template.bind({});
InlineStyle.args = {
    format: "inline",
};
InlineStyle.parameters = {
    apolloClient: resultsPageApolloClient,
};
