/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import UserSnapResults from "./UserSnapResults";

export default {
    title: "Feedback Components/UserSnapResults",
    component: UserSnapResults,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <UserSnapResults {...args} />;
};

export const Example: typeof Template = Template.bind({});
