import React, {ReactNode} from "react";
import BrandedFooter from "@/src/components/BrandedFooter.js";
export default {
    title: "App Components/BrandedFooter",
    component: BrandedFooter
};

const Template = (args): ReactNode => {
    return <BrandedFooter {...args} />;
};

export const Basic = Template.bind({});