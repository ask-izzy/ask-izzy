import type {ReactNode} from "react";
import React from "react";
import { action } from "@storybook/addon-actions";

import ShareServicesDialog from "./ShareServicesDialog";
import {ixaService, domesticViolenceService} from "@/fixtures/services";

export default {
    title: "App Components/ShareServicesDialog",
    component: ShareServicesDialog,
    args: {
        onCloseRequest: (action("onCloseRequested") as any),
    },
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <ShareServicesDialog {...args} />;
};

export const ShareSingleService: typeof Template = Template.bind({});
ShareSingleService.args = {
    services: [ixaService],
};


export const ShareTwoServices: typeof Template = Template.bind({});
ShareTwoServices.args = {
    services: [ixaService, domesticViolenceService],
};
