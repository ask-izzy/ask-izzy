import React, {ReactNode} from "react";
import SuggestionBox from "@/components/SuggestionBox";
import { getCategory } from "@/src/constants/categories";
import Category from "@/src/constants/Category";

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