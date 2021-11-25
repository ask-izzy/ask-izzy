/* @flow */

import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "react";
import React from "react";
import { action } from "@storybook/addon-actions";

import ProgressBar from "./ProgressBar"

export default {
    title: "General Components/ProgressBar",
    component: ProgressBar,
    args: {
        onClick: (action("clicked"): any),
    },
};

type QuestionStepperProps = ReactElementConfig<
    typeof ProgressBar
>

const Template = (args: Object): ReactNode => {
    (Template.args: QuestionStepperProps);
    return <ProgressBar {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    current: 1,
    total: 3,
};
