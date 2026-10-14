import type {ReactNode} from "react";
import React from "react";

import CategoriesList from "./CategoriesList";

export default {
    title: "App Components/CategoriesList",
    component: CategoriesList,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <CategoriesList {...args} />;
};

export const Example: typeof Template = Template.bind({});
