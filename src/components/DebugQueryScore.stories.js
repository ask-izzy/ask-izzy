/* @flow */

import React from "react";

import DebugQueryScore from "./DebugQueryScore";
import searchExplanationFixtures from "../../fixtures/searchExplanations";

export default {
    title: "App Components/Debug/DebugQueryScore",
    component: DebugQueryScore,
};

const Template = (args: Object) => <DebugQueryScore {...args} />;

export const Example = Template.bind({});
Example.args = {
    expl: searchExplanationFixtures.housing,
};