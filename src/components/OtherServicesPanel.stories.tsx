import type {ReactNode} from "react";
import React from "react";
import OtherServicesPanel from "./OtherServicesPanel";
import otherServicesSuggestions from "@/src/constants/other-services-suggestions";

export default {
    title: "App Components/OtherServicesPanel",
    component: OtherServicesPanel,
    argTypes: ({} as {}),
};

const Template = (args: any): ReactNode => <OtherServicesPanel {...args} />;

export const Example: typeof Template = Template.bind({});
Example.args = {
    suggestions: otherServicesSuggestions,
};

export const LongSuggestions: typeof Template = Template.bind({});
LongSuggestions.args = {
    suggestions: [
        ...otherServicesSuggestions,
        "Emergency accommodation",
        "Help paying the rent",
        "Free legal advice",
    ],
};
