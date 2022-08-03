/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import ResultsList from "./ResultsList";
import {
    ixaService,
} from "../../fixtures/services";

export default {
    title: "App Components/ToastMessageMyList",
    component: ResultsList,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ResultsList {...args} />;
};

export const AddAndRemoveService: typeof Template = Template.bind({});
AddAndRemoveService.args = {
    results: [
        ixaService,
    ],
};