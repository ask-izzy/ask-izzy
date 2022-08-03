/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import MyListResultItem from "./MyListResultItem";
import getServiceFixture from "../../fixtures/factories/Service";
import {
    getAddressLocationPropsFixture,
} from "../../fixtures/factories/AddressLocation";
import {
    ixaService,
    susansHouseService,
    housingService,
    domesticViolenceService,
} from "../../fixtures/services";

export default {
    title: "App Components/MyListResults/MyListResultItem",
    component: MyListResultItem,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <MyListResultItem {...args} />;
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
        lgbtiqa_plus_specific: true,
        indigenous_classification: ["Aboriginal (indigenous) specific"],
        location: {
            suburb: "Richmond",
            point: {
                lat: -37.8228,
                lon: 144.998,
            },
        },
    }),
}

export const NDISService: typeof Template = Template.bind({});
NDISService.args = {
    service: getServiceFixture({
        ndis_approved: true,
        location: getAddressLocationPropsFixture({
            suburb: "Richmond",
            point: {
                lat: -37.8228,
                lon: 144.998,
            },
        }),
    }),
}
