/* @flow */

import type {Node} from "React";
import React from "react";

import Email from "./Email";

export default {
    title: "Service Components/Email",
    component: Email,
};

const Template = (args: Object): Node => {
    (Template.args: any); return <Email {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    email: "person@example.com",
    comment: "Example comment",
};
