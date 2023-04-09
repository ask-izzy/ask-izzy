import React, {ReactNode} from "react";

import Link from "@/src/components/base/Link.js";


export default {
    title: "Base Components/Link",
    component: Link
};

const Template = (args): ReactNode => {
    return <Link {...args} />;
};

export const InternalLink = Template.bind({});
InternalLink.args = {
    to: "/",
    children: "Example Internal Link"
};
export const ExternalLink = Template.bind({});
ExternalLink.args = {
    to: "https://google.com",
    children: "Example External Link"
};