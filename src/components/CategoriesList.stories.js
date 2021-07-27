/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import CategoriesList from "./CategoriesList";

export default {
    title: "App Components/CategoriesList",
    component: CategoriesList,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <CategoriesList {...args} />;
};

export const Example: typeof Template = Template.bind({});
