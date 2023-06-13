import React, {ReactNode} from "react";

import ScrollToTop from "@/src/components/ResultsListPage/ScrollToTop.js";

export default {
    title: "Basic UI Components/ScrollToTop",
    component: ScrollToTop,
    argTypes: ({} as Record<string, never>)
};

const Template = (args): ReactNode => <ScrollToTop {...args} />;

export const Example = Template.bind({});
Example.label = "To top";