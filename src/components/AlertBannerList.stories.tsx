import React, {ReactNode} from "react";
import AlertBannerList from "@/src/components/AlertBannerList.js";
import alertsQuery from "@/src/queries/content/alerts.js";
import { resultsPageAlerts } from "@/test/support/mock-cms/resolvers/alerts.js";
export default {
    title: "App Components/AlertBanner/AlertBannerList",
    component: AlertBannerList
};
const resultsPageApolloClient = {
    mocks: [{
        request: {
            query: alertsQuery
        },
        result: {
            data: {
                alerts: resultsPageAlerts
            }
        }
    }]
};

const Template = (args): ReactNode => {
    return <AlertBannerList {...args} />;
};

export const ThreeBanners = Template.bind({});
ThreeBanners.parameters = {
    apolloClient: resultsPageApolloClient
};
export const InlineStyle = Template.bind({});
InlineStyle.args = {
    format: "inline"
};
InlineStyle.parameters = {
    apolloClient: resultsPageApolloClient
};