/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import Summary from "./Summary";

export default {
    title: "Base Components/Summary",
    component: Summary,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any);
    return (
        <details>
            <Summary {...args} />
            details body
        </details>
    );
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    children: `summary body`,
};
