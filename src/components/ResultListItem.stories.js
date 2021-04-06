/* @flow */

import React from "react";
import { addRouter } from "../storybook/decorators";

import ResultListItem from "./ResultListItem";
import Service from "../../fixtures/factories/Service";
import fixtures from "../../fixtures/services";

export default {
    title: "App Components/ResultsList/ResultListItem",
    component: ResultListItem,
    argTypes: {},
    decorators: [addRouter],
};

const Template = (args: Object) => <ResultListItem {...args} />;

export const InfoxchangeExample = Template.bind({});
InfoxchangeExample.args = {
    service: new Service(fixtures.ixa),
};

export const SusansHouse = Template.bind({});
SusansHouse.args = {
    service: new Service(fixtures.susansHouse),
};

export const HousingService = Template.bind({});
HousingService.args = {
    service: new Service(fixtures.housingService),
};

export const ConfidentialLocation = Template.bind({});
ConfidentialLocation.args = {
    service: new Service(fixtures.domesticviolence),
};

export const ServiceWithFlags = Template.bind({});
ServiceWithFlags.args = {
    service: new Service({
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

export const NDISService = Template.bind({});
NDISService.args = {
    service: new Service({
        ndis_approved: true,
        location: {
            suburb: "Richmond",
            point: {
                lat: -37.8228,
                lon: 144.998,
            },
        },
    }),
}