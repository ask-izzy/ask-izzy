/* @flow */

import type {Node as ReactNode} from "React";
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

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ResultsList {...args} />;
};

export const TwoServices: typeof Template = Template.bind({});
TwoServices.args = {
    results: [
        ServiceFactory(fixtures.ixa),
        ServiceFactory(fixtures.susansHouse),
    ],
};

export const IncludesCrisisLine: typeof Template = Template.bind({});
IncludesCrisisLine.args = {
    results: [
        ServiceFactory(fixtures.domesticviolence),
        ServiceFactory(fixtures.ixa),
        ServiceFactory(fixtures.susansHouse),
    ],
};
