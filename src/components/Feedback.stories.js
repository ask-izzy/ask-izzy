/* @flow */

import React from "react";

import Feedback from "./Feedback";
import fixtures from "../../fixtures/services";

export default {
    title: "App Components/Feedback",
    component: Feedback,
};

const Template = (args: Object) => <Feedback {...args} />;

export const Example = Template.bind({});
Example.args = {
    object: fixtures.ixa,
};
