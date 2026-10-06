import type {ReactNode} from "react";
import React from "react";
import getServiceFixture from "@/fixtures/factories/Service";
import MyListPrintPage from "@/src/components/PrintComponents/MyListPrintPage";

export default {
    title: "Service Components/MyListPrintPage",
    component: MyListPrintPage,
    argTypes: ({} as {}),
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <MyListPrintPage {...args} />
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    services: [getServiceFixture()],
};