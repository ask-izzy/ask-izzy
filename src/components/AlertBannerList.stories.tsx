import type {ReactNode} from "react";
import React from "react";

import AlertBannerList from "./AlertBannerList";
import alertsQuery from "@/queries/content/alerts";
import {
    resultsPageAlerts,
} from "../../test/support/mock-cms/resolvers/alerts"

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

const Template = (args: any): ReactNode => {
    (Template.args as any); return <AlertBannerList {...args} />;
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
