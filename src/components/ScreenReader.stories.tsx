import React, {ReactNode} from "react";

import ScreenReader from "@/src/components/ScreenReader.js";


export default {
    title: "Basic UI Components/ScreenReader",
    component: ScreenReader
};

const Template = (args): ReactNode => {
    return <ScreenReader {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    children: <div>Screen reader content</div>
};