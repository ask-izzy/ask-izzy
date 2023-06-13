import React, {ReactNode} from "react";

import Web from "@/src/components/Web.js";

export default {
    title: "Service Components/Web",
    component: Web
};

const Template = (args): ReactNode => {
    return <Web {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    url: "https://example.com/landingPage"
};