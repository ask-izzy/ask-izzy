/* @flow */

import type {Node} from "React";
import React from "react";

import Feedback from "./Feedback";
import fixtures from "../../fixtures/services";

export default {
    title: "App Components/Feedback",
    component: Feedback,
};

const Template = (args: Object): Node => {
    (Template.args: any); return <Feedback {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    object: fixtures.ixa,
};
