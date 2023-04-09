import React, {ReactNode} from "react";

import ServicePane from "@/src/components/ServicePane.js";
import { ixaService, youthSupportNetService } from "@/fixtures/services.js";
import alertsQuery from "@/src/queries/content/alerts.js";
import { vicServiceAlert } from "@/test/support/mock-cms/resolvers/alerts.js";


export default {
    title: "Service Components/ServicePane",
    component: ServicePane
};

const Template = (args): ReactNode => {
    return <ServicePane {...args} />;
};

export const ISSService = Template.bind({});
ISSService.args = {
    service: ixaService
};
ISSService.parameters = {
    apolloClient: getApolloConfig({
        state: "VIC",
        screenLocation: "servicePage"
    }, [])
};
export const ISSServiceWithAlerts = Template.bind({});
ISSServiceWithAlerts.args = {
    service: ixaService
};
ISSServiceWithAlerts.parameters = {
    apolloClient: getApolloConfig({
        state: "VIC",
        screenLocation: "servicePage"
    }, [vicServiceAlert])
};
export const YouthSupportNetService = Template.bind({});
YouthSupportNetService.args = {
    service: youthSupportNetService
};
YouthSupportNetService.parameters = {
    apolloClient: getApolloConfig({
        state: "",
        screenLocation: "servicePage"
    }, [])
};

function getApolloConfig(variables: Record<string, any>, alerts: Array<Record<string, any>>) {
    return {
        mocks: [{
            request: {
                query: alertsQuery,
                variables
            },
            result: {
                data: {
                    alerts
                }
            }
        }]
    };
}