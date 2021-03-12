/* @flow */

import React from "react";

import Email from "./Email";

export default {
    title: "Service Components/Email",
    component: Email,
};

const Template = (args: Object) => <Email {...args} />;

export const Example = Template.bind({});
Example.args = {
    email: "person@example.com",
    comment: "Example comment",
};
