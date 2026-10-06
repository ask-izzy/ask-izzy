import type {ReactNode} from "react";
import React from "react";

import CrisisHeader from "./CrisisHeader";

export default {
    title: "App Components/Crisis Line/CrisisHeader",
    component: CrisisHeader,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <CrisisHeader {...args} />;
};

export const Header: typeof Template = Template.bind({});
