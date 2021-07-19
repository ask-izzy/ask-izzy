/* @flow */

import React from "react";
import { action } from "@storybook/addon-actions";

import Collapser from "./Collapser"

export default {
    title: "General Components/Collapser",
    component: Collapser,
    args: {
        onClick: action("clicked"),
    },
};

const Template = (args: Object) => <Collapser {...args} />;

export const CollapsedByDefault = Template.bind({});
CollapsedByDefault.args = {
    expandMessage: "Open section",
    closeMessage: "Close section",
    children: "Body text",
};


export const ExpandedByDefault = Template.bind({});
ExpandedByDefault.args = {
    expandMessage: "Open section",
    collapseMessage: "Close section",
    initiallyExpanded: true,
    children: "Body text",
};

export const BodyWithJSXElements = Template.bind({});
BodyWithJSXElements.args = {
    expandMessage: "Open section",
    collapseMessage: "Close section",
    initiallyExpanded: true,
    children: <div>
      The Collapser body takes JSX elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </div>,
};

export const HasContentPreview = Template.bind({});
HasContentPreview.args = {
    contentPreview: "Excerpt text... ",
    expandMessage: "Read more",
    children: "Excerpt text shows until you expand.",
};
