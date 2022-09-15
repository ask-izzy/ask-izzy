/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import AddToCompareButton from "./AddToCompareButton";
import {ixaService} from "../../fixtures/services";

export default {
    title: "App Components/AddToCompareButton",
    component: AddToCompareButton,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <AddToCompareButton service={ixaService}/>;
};

export const Example: typeof Template = Template.bind({});
