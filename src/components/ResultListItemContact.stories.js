/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import getServiceFixture from "@/fixtures/factories/Service";
import ResultListItemContact from "@/src/components/ResultListItemContact";

export default {
    title: "Service Components/ResultListItemContact",
    component: ResultListItemContact,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ResultListItemContact {...args} />
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    service: getServiceFixture(),
};