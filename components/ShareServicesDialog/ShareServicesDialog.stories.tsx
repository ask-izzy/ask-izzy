import React, {ReactNode} from "react";
import { action } from "@storybook/addon-actions";

import ShareServicesDialog from "@/components/ShareServicesDialog/ShareServicesDialog.js";
import { ixaService, domesticViolenceService } from "@/fixtures/services.js";


export default {
    title: "App Components/ShareServicesDialog",
    component: ShareServicesDialog,
    args: {
        onCloseRequest: (action("onCloseRequested") as any)
    }
};

const Template = (args): ReactNode => {
    return <ShareServicesDialog {...args} />;
};

export const ShareSingleService = Template.bind({});
ShareSingleService.args = {
    services: [ixaService]
};
export const ShareTwoServices = Template.bind({});
ShareTwoServices.args = {
    services: [ixaService, domesticViolenceService]
};