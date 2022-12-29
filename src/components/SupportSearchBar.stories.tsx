import React, {ReactNode} from "react";

import SupportSearchBar from "@/src/components/SupportSearchBar.js";

export default {
    title: "App components/SupportSearchBar",
    component: SupportSearchBar
};

const Template = (): ReactNode => <SupportSearchBar />;

export const JustTheSearchBar = Template.bind({});