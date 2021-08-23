/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import FreeLowCostLabel from "./FreeLowCostLabel";

export default {
    title: "Basic UI Components/Labels/FreeLowCostLabel",
    component: FreeLowCostLabel,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => <FreeLowCostLabel {...args} />;

export const Example: typeof Template = Template.bind({});
