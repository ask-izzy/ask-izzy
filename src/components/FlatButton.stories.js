/* @flow */

import type {Node} from "React";
import React from "react";
import { action } from "@storybook/addon-actions";

import FlatButton from "./FlatButton";

export default {
    title: "Basic UI Components/FlatButton",
    component: FlatButton,
    args: {
        onClick: (action("clicked"): any),
    },
};

const Template = (args: Object): Node => {
    (Template.args: any); return <FlatButton {...args} />;
};

export const BasicButton: typeof Template = Template.bind({});
BasicButton.args = {
    label: "Example Button",
};

export const DisabledButton: typeof Template = Template.bind({});
DisabledButton.args = {
    label: "Example Button",
    disabled: true,
};

export const ButtonWithJSXChildren: typeof Template = Template.bind({});
ButtonWithJSXChildren.args = {
    label: "Example Button",
    children: <p>
      As well as a label FlatButton also takes children which can be JSX
      elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </p>,
};
