/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import BetaBanner from "./BetaBanner";

export default {
    title: "App Components/BetaBanner",
    component: BetaBanner,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <BetaBanner {...args} />;
};

export const BasicText: typeof Template = Template.bind({});



