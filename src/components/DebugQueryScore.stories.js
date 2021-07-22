/* @flow */

import type {Node} from "React";
import React from "react";

import DebugQueryScore from "./DebugQueryScore";
import searchExplanationFixtures from "../../fixtures/searchExplanations";

export default {
    title: "App Components/Debug/DebugQueryScore",
    component: DebugQueryScore,
};

const Template = (args: Object): Node => {
    (Template.args: any); return <DebugQueryScore {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    expl: searchExplanationFixtures.housing,
};
