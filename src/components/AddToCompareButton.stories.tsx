import React, {ReactNode} from "react";

import AddToCompareButton from "@/src/components/AddToCompareButton.js";
import { ixaService } from "@/fixtures/services.js";


export default {
    title: "App Components/AddToCompareButton",
    component: AddToCompareButton
};

const Template = (): ReactNode => {
    return <AddToCompareButton service={ixaService} />;
};

export const Example = Template.bind({});