import type {ReactNode} from "react";
import React from "react";

import MyListResultItem from "./MyListResultItem";
import getServiceFixture from "../../fixtures/factories/Service";
import {
    ixaService,
    susansHouseService,
    housingService,
    domesticViolenceService,
} from "../../fixtures/services";

export default {
    title: "App Components/MyListResults/MyListResultItem",
    component: MyListResultItem,
    argTypes: ({} as {}),
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <MyListResultItem {...args} />;
};

export const InfoxchangeExample: typeof Template = Template.bind({});
InfoxchangeExample.args = {
    service: ixaService,
};

export const SusansHouse: typeof Template = Template.bind({});
SusansHouse.args = {
    service: susansHouseService,
};

export const HousingService: typeof Template = Template.bind({});
HousingService.args = {
    service: housingService,
};

export const ConfidentialLocation: typeof Template = Template.bind({});
ConfidentialLocation.args = {
    service: domesticViolenceService,
};

export const ServiceWithFlags: typeof Template = Template.bind({});
ServiceWithFlags.args = {
    service: getServiceFixture({
        is_lgbtiqa_plus_specific: true,
        indigenous_classification: "specific",
        site: {
            location: {
                suburb: "Richmond",
                geo_point: {
                    lat: -37.8228,
                    lon: 144.998,
                },
            },
        },
    }),
}

export const NDISService: typeof Template = Template.bind({});
NDISService.args = {
    service: getServiceFixture({
        is_ndis_approved: true,
        site: {
            location: {
                suburb: "Richmond",
                geo_point: {
                    lat: -37.8228,
                    lon: 144.998,
                },
            },
        },
    }),
}
