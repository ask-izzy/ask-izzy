import React, {ReactNode} from "react";

import ShareButton from "@/src/components/ShareButton.js";


export default {
    title: "App Components/ShareServicesDialog",
    component: ShareButton
};

const Template = (args): ReactNode => {
    return <ShareButton {...args} />;
};

export const ShareButtonWithoutText = Template.bind({});
export const ShareButtonWithText = Template.bind({});
ShareButtonWithText.args = {
    hasTextDescription: true
};