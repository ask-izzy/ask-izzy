import React, {ReactNode} from "react";

import ShareDirectlyOptions from "@/components/ShareServicesDialog/ShareDirectlyOptions.js";
import { ixaService, domesticViolenceService } from "@/fixtures/services.js";

export default {
    title: "App Components/ShareDirectlyOptions",
    component: ShareDirectlyOptions
};

const Template = (args): ReactNode => {
    return <ShareDirectlyOptions {...args} />;
};

export const ShareSingleService = Template.bind({});
ShareSingleService.args = {
    services: [ixaService]
};
export const ShareTwoServices = Template.bind({});
ShareTwoServices.args = {
    services: [ixaService, domesticViolenceService]
};