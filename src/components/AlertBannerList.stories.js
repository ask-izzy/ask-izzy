/* @flow */
import React from "react";

import AlertBannerList from "./AlertBannerList";
import alertsQuery from "../queries/content/alerts.js";
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

const Template = (args: Object) => <AlertBannerList {...args} />;

export const ThreeBanners = Template.bind({});
ThreeBanners.parameters = {
    apolloClient: resultsPageApolloClient,
};

export const InlineStyle = Template.bind({});
InlineStyle.args = {
    format: "inline",
};
InlineStyle.parameters = {
    apolloClient: resultsPageApolloClient,
};
