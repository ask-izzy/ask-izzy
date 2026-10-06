import type {ReactNode} from "react";
import React from "react";

import { getCategory } from "../constants/categories";
import CategoryListItem from "./CategoryListItem";

export default {
    title: "App Components/ListItem/CategoryListItem",
    component: CategoryListItem,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <CategoryListItem {...args} />;
};

export const Housing: typeof Template = Template.bind({});
Housing.args = {
    category: getCategory("housing"),
};
