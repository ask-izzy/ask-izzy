import type {ReactNode} from "react";
import React from "react";
import ScrollToTop from "./ScrollToTop";

export default {
    title: "Basic UI Components/ScrollToTop",
    component: ScrollToTop,
    argTypes: ({} as {}),
};

const Template = (args: any): ReactNode => <ScrollToTop {...args} />;

export const Example: typeof Template = Template.bind({});
Example.label = "To top";
