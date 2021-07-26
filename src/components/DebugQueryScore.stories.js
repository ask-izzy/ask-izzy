/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import DebugQueryScore from "./DebugQueryScore";
import searchExplanationFixtures from "../../fixtures/searchExplanations";

export default {
    title: "App Components/Debug/DebugQueryScore",
    component: DebugQueryScore,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <DebugQueryScore {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    expl: searchExplanationFixtures.housing,
};
