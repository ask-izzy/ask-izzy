/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import ScrollToTop from "./ScrollToTop";

export default {
    title: "Basic UI Components/ScrollToTop",
    component: ScrollToTop,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => <ScrollToTop {...args} />;

export const Example: typeof Template = Template.bind({});
Example.label = "To top";
