/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import ShareButton from "./ShareButton";

export default {
    title: "App Components/ShareServicesDialog",
    component: ShareButton,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ShareButton {...args} />;
};

export const ShareButtonWithoutText: typeof Template = Template.bind({});
export const ShareButtonWithText: typeof Template = Template.bind({});
ShareButtonWithText.args = {
    hasTextDescription: true,
};