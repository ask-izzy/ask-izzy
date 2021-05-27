/* @flow */
import React from "react";

import AlertBannerList from "./AlertBannerList";
import alertsQuery from "../queries/content/alerts.js";
import alertQueryResponse from "../../test/support/mock-cms/results/alerts/three-alerts.js"

export default {
    title: "App Components/AlertBanner/AlertBannerList",
    component: AlertBannerList,
};

const Template = (args: Object) => <AlertBannerList {...args} />;

export const ThreeBanners = Template.bind({});
ThreeBanners.parameters = {
    apolloClient: {
        mocks: [
            {
                request: {
                    query: alertsQuery,
                },
                result: alertQueryResponse,
            },
        ],
    },
};

export const InlineStyle = Template.bind({});
InlineStyle.args = {
    format: "inline",
};
InlineStyle.parameters = {
    apolloClient: {
        mocks: [
            {
                request: {
                    query: alertsQuery,
                },
                result: alertQueryResponse,
            },
        ],
    },
};
