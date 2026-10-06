import type {ReactNode} from "react";
import React from "react";
import Summary from "./Summary";

export default {
    title: "Base Components/Summary",
    component: Summary,
    argTypes: ({} as {}),
};

const Template = (args: any): ReactNode => {
    (Template.args as any);
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
