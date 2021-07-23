/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import Email from "./Email";

export default {
    title: "Service Components/Email",
    component: Email,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <Email {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    email: "person@example.com",
    comment: "Example comment",
};
