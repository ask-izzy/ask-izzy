/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import CrisisResultsList from "./CrisisResultsList";

export default {
    title: "App Components/Crisis Line/CrisisResultsList",
    component: CrisisResultsList,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <CrisisResultsList {...args} />;
};

export const Example: typeof Template = Template.bind({});
