import React, {ReactNode} from "react";

import SortResult from "./SortResult";

export default {
    title: "Basic UI Components/Sort Results",
    component: SortResult,
    argTypes: ({} as Record<string, never>)
};

const Template = (args): ReactNode => <SortResult {...args} />;

export const Example = Template.bind({});
Example.title = "Test";