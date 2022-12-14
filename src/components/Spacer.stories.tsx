import React, {ReactNode} from "react";

import Spacer from "@/src/components/Spacer";

export default {
    title: "Basic UI Components/Spacer",
    component: Spacer
};

const Template = (args): ReactNode => {
    return <Spacer {...args} />;
};

export const Example = Template.bind({});