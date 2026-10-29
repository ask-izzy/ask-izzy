import type {ReactNode} from "react";
import React from "react";

import Feedback from "./Feedback";
import {ixaService} from "../../fixtures/services";

export default {
    title: "App Components/Feedback",
    component: Feedback,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <Feedback {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    object: ixaService,
};
