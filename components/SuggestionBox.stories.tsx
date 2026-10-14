import type {ReactNode} from "react";
import React from "react";

import SuggestionBox from "./SuggestionBox";
import { getCategory } from "@/src/constants/categories";
import Category from "@/src/constants/Category";

export default {
    title: "App Components/SuggestionBox",
    component: SuggestionBox,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <SuggestionBox {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    category: (getCategory("food") as Category | null | undefined),
    searchTerm: "cheep food",
    pathname: "/food",
    results: [],
};
