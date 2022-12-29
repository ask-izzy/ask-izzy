import React, {ReactNode} from "react";

import Feedback from "@/src/components/Feedback.js";
import { ixaService } from "@/fixtures/services.js";

export default {
    title: "App Components/Feedback",
    component: Feedback
};

const Template = (args): ReactNode => {
    return <Feedback {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    object: ixaService
};