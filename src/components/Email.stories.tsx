import React, {ReactNode} from "react";

import Email from "@/src/components/Email.js";


export default {
    title: "Service Components/Email",
    component: Email
};

const Template = (args): ReactNode => {
    return <Email {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    email: "person@example.com",
    comment: "Example comment"
};