import React, {ReactNode} from "react";

import BoxedTextDivider from "@/src/components/BoxedTextDivider.js";


export default {
    title: "Basic UI Components/BoxedText/BoxedTextDivider",
    component: BoxedTextDivider
};

const Template = (args): ReactNode => {
    return <BoxedTextDivider {...args} />;
};

export const Basic = Template.bind({});