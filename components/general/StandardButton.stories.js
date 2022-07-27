/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import { action } from "@storybook/addon-actions";

import StandardButton from "./StandardButton";

export default {
    title: "Basic UI Components/StandardButton",
    component: StandardButton,
    args: {
        onClick: (action("clicked"): any),
    },
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <StandardButton {...args} />;
};

export const PrimaryButton: typeof Template = Template.bind({});
PrimaryButton.args = {
    label: "Example Button",
};

export const PrimaryButtonDisabled: typeof Template = Template.bind({});
PrimaryButtonDisabled.args = {
    label: "Example Button",
    disabled: true,
};

export const PrimaryButtonWithJSXChildren: typeof Template = Template.bind({});
PrimaryButtonWithJSXChildren.args = {
    label: "Example Button",
    children: <p>
      As well as a label StandardButton also takes children which can be JSX
      elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </p>,
};
export const SecondaryButton: typeof Template = Template.bind({});
SecondaryButton.args = {
    label: "Example Button",
    type: "secondary",
};

export const SecondaryButtonDisabled: typeof Template = Template.bind({});
SecondaryButtonDisabled.args = {
    label: "Example Button",
    disabled: true,
    type: "secondary",
};

export const SecondaryButtonWithJSXChildren: typeof Template = Template.bind({});
SecondaryButtonWithJSXChildren.args = {
    label: "Example Button",
    children: <p>
      As well as a label StandardButton also takes children which can be JSX
      elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </p>,
    type: "secondary",
};
