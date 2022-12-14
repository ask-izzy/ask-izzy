import React, {ReactNode} from "react";
import CategoriesList from "@/src/components/CategoriesList";
export default {
    title: "App Components/CategoriesList",
    component: CategoriesList
};

const Template = (args): ReactNode => {
    return <CategoriesList {...args} />;
};

export const Example = Template.bind({});