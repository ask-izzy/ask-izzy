/* @flow */

import React from "react";
import { addRouter } from "../storybook/decorators";

import ResultListItem from "./ResultListItem";
import iss from "../iss";
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
    object: new iss.Service(fixtures.ixa),
};

export const SusansHouse = Template.bind({});
SusansHouse.args = {
    object: new iss.Service(fixtures.susansHouse),
};

export const HousingService = Template.bind({});
HousingService.args = {
    object: new iss.Service(fixtures.housingService),
};

export const ConfidentialLocation = Template.bind({});
ConfidentialLocation.args = {
    object: new iss.Service(fixtures.domesticviolence),
};