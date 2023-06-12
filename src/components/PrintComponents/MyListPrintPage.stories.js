/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import getServiceFixture from "@/fixtures/factories/Service";
import MyListPrintPage from "@/src/components/PrintComponents/MyListPrintPage";

export default {
    title: "Service Components/MyListPrintPage",
    component: MyListPrintPage,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <MyListPrintPage {...args} />
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    services: [getServiceFixture()],
};