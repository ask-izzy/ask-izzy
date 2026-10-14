import type {ReactNode} from "react";
import React from "react";
import Controls from "./Controls";

export default {
    title: "Basic UI Components/Controls",
    component: Controls,
    argTypes: ({} as {}),
};

const Template = (args: any): ReactNode => <Controls {...args} />;

export const Example: typeof Template = Template.bind({});
Example.args = {
    orderByCallback: () => { },
};
