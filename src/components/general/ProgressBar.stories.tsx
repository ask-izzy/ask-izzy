import type {
    ReactNode,
    ComponentProps as ReactElementConfig,
} from "react";
import React from "react";
import { action } from "@storybook/addon-actions";

import ProgressBar from "./ProgressBar"

export default {
    title: "General Components/ProgressBar",
    component: ProgressBar,
    args: {
        onClick: (action("clicked") as any),
    },
};

type QuestionStepperProps = ReactElementConfig<
    typeof ProgressBar
>

const Template = (args: any): ReactNode => {
    (Template.args as QuestionStepperProps);
    return <ProgressBar {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    current: 1,
    total: 3,
};
