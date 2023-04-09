import React, {ReactNode} from "react";

import Controls from "@/src/components/ResultsListPage/Controls.js";


export default {
    title: "Basic UI Components/Controls",
    component: Controls,
    argTypes: ({} as Record<string, never>)
};

const Template = (args): ReactNode => <Controls {...args} />;

export const Example = Template.bind({});
Example.args = {
    orderByCallback: () => undefined
};