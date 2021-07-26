/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import { addRouter } from "../storybook/decorators";

import { getCategory } from "../constants/categories";
import CategoryListItem from "./CategoryListItem";

export default {
    title: "App Components/ListItem/CategoryListItem",
    component: CategoryListItem,
    decorators: [addRouter],
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <CategoryListItem {...args} />;
};

export const Housing: typeof Template = Template.bind({});
Housing.args = {
    category: getCategory("housing"),
};
