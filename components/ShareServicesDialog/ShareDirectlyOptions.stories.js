/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import ShareDirectlyOptions from "./ShareDirectlyOptions";
import {ixaService, domesticViolenceService} from "@/fixtures/services";

export default {
    title: "App Components/ShareDirectlyOptions",
    component: ShareDirectlyOptions,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ShareDirectlyOptions {...args} />;
};

export const ShareSingleService: typeof Template = Template.bind({});
ShareSingleService.args = {
    services: [ixaService],
};


export const ShareTwoServices: typeof Template = Template.bind({});
ShareTwoServices.args = {
    services: [ixaService, domesticViolenceService],
};
