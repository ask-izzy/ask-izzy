import React, {ReactNode} from "react";
import SuggestionBox from "@/components/SuggestionBox.js";
import { getCategory } from "@/src/constants/categories.js";
import Category from "@/src/constants/Category.js";


export default {
    title: "App Components/SuggestionBox",
    component: SuggestionBox
};

const Template = (args: Record<string, any>): ReactNode => {
    return <SuggestionBox {...args as any} />;
};

export const Example = Template.bind({});

Example.args = {
    category: (getCategory("food") as Category | null | undefined),
    searchTerm: "cheep food",
    pathname: "/food",
    results: []
};