/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import Feedback from "./Feedback";
import {ixaService} from "../../fixtures/services";

export default {
    title: "App Components/Feedback",
    component: Feedback,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <Feedback {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    object: ixaService,
};
