import type {ReactNode} from "react";
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

const Template = (args: any): ReactNode => {
    (Template.args as any); return <MyListResults {...args} />;
};

export const TwoServices: typeof Template = Template.bind({});
TwoServices.args = {
    results: [
        ixaService,
        susansHouseService,
    ],
};