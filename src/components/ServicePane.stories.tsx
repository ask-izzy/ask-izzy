import React, {ReactNode} from "react";

import ServicePane from "@/src/components/ServicePane";
import { ixaService, youthSupportNetService } from "@/fixtures/services";
import alertsQuery from "@/src/queries/content/alerts";
import { vicServiceAlert } from "@/test/support/mock-cms/resolvers/alerts";

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