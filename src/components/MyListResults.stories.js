/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import MyListResults from "./MyListResults";
import {
    ixaService,
    susansHouseService,
} from "../../fixtures/services";

export default {
    title: "App Components/MyListResults",
    component: MyListResults,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <MyListResults {...args} />;
};

export const TwoServices: typeof Template = Template.bind({});
TwoServices.args = {
    results: [
        ixaService,
        susansHouseService,
    ],
};