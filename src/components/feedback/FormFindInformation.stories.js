/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import FormFindInformation from "./FormFindInformation";

export default {
    title: "Feedback Components/FormFindInformation",
    component: FormFindInformation,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <FormFindInformation {...args} />;
};

export const Example: typeof Template = Template.bind({});
