/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import { action } from "@storybook/addon-actions";

import SendForm from "./SendForm";
import {ixaService, domesticViolenceService} from "@/fixtures/services";

export default {
    title: "App Components/SendForm",
    component: SendForm,
    args: {
        onCloseRequest: (action("onCloseRequested"): any),
    },
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <SendForm {...args} />;
};

export const ShareSingleService: typeof Template = Template.bind({});
ShareSingleService.args = {
    services: [ixaService],
};


export const ShareTwoServices: typeof Template = Template.bind({});
ShareTwoServices.args = {
    services: [ixaService, domesticViolenceService],
};
