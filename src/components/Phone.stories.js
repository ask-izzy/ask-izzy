/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import Phone from "./Phone";

export default {
    title: "Service Components/Phone",
    component: Phone,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <Phone {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    comment: "Comment about this number",
    kind: "phone",
    number: "(03) 3333 3333",
};

export const NoComment: typeof Template = Template.bind({});
NoComment.args = {
    kind: "kind is displayed instead",
    number: "(03) 3333 3333",
};

export const LongComment: typeof Template = Template.bind({});
LongComment.args = {
    comment: "Here is a phone number with a long comment" +
        ", like, a really long comment",
    kind: "phone",
    number: "(03) 3333 3333",
};

export const CrisisNumber: typeof Template = Template.bind({});
CrisisNumber.args = {
    comment: "Comment about this number",
    kind: "phone",
    number: "(03) 3333 3333",
    crisis: true,
};
