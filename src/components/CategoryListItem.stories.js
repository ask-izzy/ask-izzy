/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import { getCategory } from "../constants/categories";
import CategoryListItem from "./CategoryListItem";

export default {
    title: "App Components/ListItem/CategoryListItem",
    component: CategoryListItem,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <CategoryListItem {...args} />;
};

export const Housing: typeof Template = Template.bind({});
Housing.args = {
    category: getCategory("housing"),
};
