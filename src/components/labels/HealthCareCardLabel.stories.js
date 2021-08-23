/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import HealthCareCardLabel from "./HealthCareCardLabel";

export default {
    title: "Basic UI Components/Labels/HealthCareCardLabel",
    component: HealthCareCardLabel,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => <HealthCareCardLabel {...args} />;

export const Example: typeof Template = Template.bind({});
