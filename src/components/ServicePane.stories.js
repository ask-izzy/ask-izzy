/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import ServicePane from "./ServicePane";
import {
    ixaService,
    youthSupportNetService,
} from "../../fixtures/services";
import alertsQuery from "../queries/content/alerts.js";
import {
    vicServiceAlert,
} from "../../test/support/mock-cms/resolvers/alerts.js"


export default {
    title: "Service Components/ServicePane",
    component: ServicePane,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ServicePane {...args} />;
};

export const ISSService: typeof Template = Template.bind({});
ISSService.args = {
    service: ixaService,
};
ISSService.parameters = {
    apolloClient: getApolloConfig(
        {
            state: "VIC",
            screenLocation: "servicePage",
        },
        []
    ),
}

export const ISSServiceWithAlerts: typeof Template = Template.bind({});
ISSServiceWithAlerts.args = {
    service: ixaService,
};
ISSServiceWithAlerts.parameters = {
    apolloClient: getApolloConfig(
        {
            state: "VIC",
            screenLocation: "servicePage",
        },
        [vicServiceAlert]
    ),
}

export const YouthSupportNetService: typeof Template = Template.bind({});
YouthSupportNetService.args = {
    service: youthSupportNetService,
};
YouthSupportNetService.parameters = {
    apolloClient: getApolloConfig(
        {
            state: "",
            screenLocation: "servicePage",
        },
        []
    ),
}

function getApolloConfig(variables: Object, alerts: Array<Object>) {
    return {
        mocks: [
            {
                request: {
                    query: alertsQuery,
                    variables,
                },
                result: {
                    data: {
                        alerts,
                    },
                },
            },
        ],
    }
}
