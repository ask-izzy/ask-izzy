/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import AddToCompareButton from "./AddToCompareButton";

export default {
    title: "App Components/AddToCompareButton",
    component: AddToCompareButton,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <AddToCompareButton serviceID={12345678}/>;
};

export const Example: typeof Template = Template.bind({});
