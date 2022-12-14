import React, {ReactNode} from "react";

import { getCategory } from "@/src/constants/categories";
import CategoryListItem from "@/src/components/CategoryListItem";

export default {
    title: "App Components/ListItem/CategoryListItem",
    component: CategoryListItem
};

const Template = (args): ReactNode => {
    return <CategoryListItem {...args} />;
};

export const Housing = Template.bind({});
Housing.args = {
    category: getCategory("housing")
};