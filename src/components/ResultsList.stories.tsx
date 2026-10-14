import type {ReactNode} from "react";
import React from "react";

import ResultsList from "./ResultsList";
import {
    ixaService,
    susansHouseService,
    domesticViolenceService,
} from "../../fixtures/services";

export default {
    title: "App Components/ResultsList",
    component: ResultsList,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <ResultsList {...args} />;
};

export const TwoServices: typeof Template = Template.bind({});
TwoServices.args = {
    results: [
        ixaService,
        susansHouseService,
    ],
};

export const IncludesCrisisLine: typeof Template = Template.bind({});
IncludesCrisisLine.args = {
    results: [
        domesticViolenceService,
        ixaService,
        susansHouseService,
    ],
};
