import type {ReactNode} from "react";
import React from "react";
import getServiceFixture from "@/fixtures/factories/Service";
import ResultListItemContact from "@/src/components/ResultListItemContact";

export default {
    title: "Service Components/ResultListItemContact",
    component: ResultListItemContact,
    argTypes: ({} as {}),
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <ResultListItemContact {...args} />
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    service: getServiceFixture(),
};