/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import PrintButton from "./PrintButton";

export default {
    title: "Service Components/PrintButton",
    component: PrintButton,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <PrintButton {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    componentToPrint: <>hello world</>,

};
