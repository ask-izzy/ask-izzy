/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import SuggestionBox from "./SuggestionBox";
import { getCategory } from "@/src/constants/categories";
import type {categoryType} from "@/src/constants/Category";

export default {
    title: "App Components/SuggestionBox",
    component: SuggestionBox,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <SuggestionBox {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    category: (getCategory("food"): ?categoryType),
    searchTerm: "cheep food",
    pathname: "/food",
    results: [],
};
