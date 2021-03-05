/* @flow */

import React from "react";
import { addRouter } from "../storybook/decorators";

import ResultsList from "./ResultsList";
import fixtures from "../../fixtures/services";
import ServiceFactory from "../../fixtures/factories/Service";

export default {
    title: "App Components/ResultsList",
    component: ResultsList,
    decorators: [addRouter],
};

const Template = (args: Object) => <ResultsList {...args} />;

export const TwoServices = Template.bind({});
TwoServices.args = {
    results: [
        ServiceFactory(fixtures.ixa),
        ServiceFactory(fixtures.susansHouse),
    ],
};

export const IncludesCrisisLine = Template.bind({});
IncludesCrisisLine.args = {
    results: [
        ServiceFactory(fixtures.domesticviolence),
        ServiceFactory(fixtures.ixa),
        ServiceFactory(fixtures.susansHouse),
    ],
};
