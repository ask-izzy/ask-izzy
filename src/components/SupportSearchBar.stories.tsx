import type {ReactNode} from "react";
import React from "react";

import SupportSearchBar from "./SupportSearchBar";

export default {
    title: "App components/SupportSearchBar",
    component: SupportSearchBar,
};

const Template = (): ReactNode => <SupportSearchBar />

export const JustTheSearchBar: typeof Template = Template.bind({});