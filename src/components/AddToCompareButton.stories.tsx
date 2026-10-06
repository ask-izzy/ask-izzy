import type {ReactNode} from "react";
import React from "react";

import AddToCompareButton from "./AddToCompareButton";
import {ixaService} from "../../fixtures/services";

export default {
    title: "App Components/AddToCompareButton",
    component: AddToCompareButton,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <AddToCompareButton service={ixaService}/>;
};

export const Example: typeof Template = Template.bind({});
