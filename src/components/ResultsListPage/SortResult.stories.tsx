import type {ReactNode} from "react";
import React from "react";
import SortResult from "./SortResult";

export default {
    title: "Basic UI Components/Sort Results",
    component: SortResult,
    argTypes: ({} as {}),
};

const Template = (args: any): ReactNode => <SortResult {...args} />;

export const Example: typeof Template = Template.bind({});
Example.title = "Test";
