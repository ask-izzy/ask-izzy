import type {ReactNode} from "react";
import React from "react";
import { action } from "@storybook/addon-actions";

import Collapser from "./Collapser"

export default {
    title: "General Components/Collapser",
    component: Collapser,
    args: {
        onClick: (action("clicked") as any),
    },
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <Collapser {...args} />;
};

export const CollapsedByDefault: typeof Template = Template.bind({});
CollapsedByDefault.args = {
    expandMessage: "Open section",
    closeMessage: "Close section",
    children: "Body text",
};


export const ExpandedByDefault: typeof Template = Template.bind({});
ExpandedByDefault.args = {
    expandMessage: "Open section",
    collapseMessage: "Close section",
    externalCollapsed: true,
    children: "Body text",
};

export const BodyWithJSXElements: typeof Template = Template.bind({});
BodyWithJSXElements.args = {
    expandMessage: "Open section",
    collapseMessage: "Close section",
    externalCollapsed: true,
    children: <div>
      The Collapser body takes JSX elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </div>,
};

export const HasContentPreview: typeof Template = Template.bind({});
HasContentPreview.args = {
    contentPreview: "Excerpt text... ",
    expandMessage: "Read more",
    children: "Excerpt text shows until you expand.",
};
