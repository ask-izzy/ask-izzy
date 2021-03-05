/* @flow */

import React from "react";
import { addRouter } from "../storybook/decorators";

import { getCategory } from "../constants/categories";
import CategoryListItem from "./CategoryListItem";

export default {
    title: "App Components/ListItem/CategoryListItem",
    component: CategoryListItem,
    decorators: [addRouter],
};

const Template = (args: Object) => <CategoryListItem {...args} />;

export const Housing = Template.bind({});
Housing.args = {
    category: getCategory("housing"),
};
