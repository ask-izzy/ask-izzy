/* @flow */

import React from "react";
import { action } from "@storybook/addon-actions";

import Collapser from "./Collapser";
import { addRouter } from "../storybook/decorators";

export default {
    title: "Basic UI Components/Collapser",
    component: Collapser,
    args: {
        onClick: action("clicked"),
    },
    decorators: [addRouter],
};

const Template = (args: Object) => <Collapser {...args} />;

export const CollapsedByDefault = Template.bind({});
CollapsedByDefault.args = {
    message: "Open section",
    closeMessage: "Close section",
    children: "Body text",
};


export const ExpandedByDefault = Template.bind({});
ExpandedByDefault.args = {
    message: "Open section",
    closeMessage: "Close section",
    expanded: true,
    children: "Body text",
};

export const BodyWithJSXElements = Template.bind({});
BodyWithJSXElements.args = {
    message: "Open section",
    closeMessage: "Close section",
    expanded: true,
    children: <div>
      The Collapser body takes JSX elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </div>,
};