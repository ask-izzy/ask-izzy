import React, {ReactNode} from "react";

import CrisisHeader from "@/src/components/CrisisHeader";

export default {
    title: "App Components/Crisis Line/CrisisHeader",
    component: CrisisHeader
};

const Template = (args): ReactNode => {
    return <CrisisHeader {...args} />;
};

export const Header = Template.bind({});