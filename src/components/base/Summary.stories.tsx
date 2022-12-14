import React, {ReactNode} from "react";

import Summary from "@/src/components/base/Summary";

export default {
    title: "Base Components/Summary",
    component: Summary,
    argTypes: {}
};

const Template = (args): ReactNode => {
    return <details>
        <Summary {...args} />
            details body
    </details>;
};

export const Example = Template.bind({});
Example.args = {
    children: `summary body`
};