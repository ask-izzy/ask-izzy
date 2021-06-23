/* @flow */

import React from "react";
import BulkBilledLabel from "./BulkBilledLabel";

export default {
    title: "Basic UI Components/Labels/BulkBilledLabel",
    component: BulkBilledLabel,
    argTypes: {},
};

const Template = (args: Object) => <BulkBilledLabel {...args} />;

export const Example = Template.bind({});
