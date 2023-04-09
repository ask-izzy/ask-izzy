import React, {ReactNode} from "react";
import { action } from "@storybook/addon-actions";

import SendForm from "@/components/ShareServicesDialog/SendForm.js";
import {ixaService, domesticViolenceService} from "@/fixtures/services.js";


export default {
    title: "App Components/SendForm",
    component: SendForm,
    args: {
        onCloseRequest: (action("onCloseRequested") as any)
    }
};

const Template = (args): ReactNode => {
    return <SendForm {...args} />;
};

export const ShareSingleService = Template.bind({});
ShareSingleService.args = {
    services: [ixaService]
};
export const ShareTwoServices = Template.bind({});
ShareTwoServices.args = {
    services: [ixaService, domesticViolenceService]
};