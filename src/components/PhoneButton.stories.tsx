import type {ReactNode} from "react";
import React from "react";

import PhoneButton from "./PhoneButton";

export default {
    title: "Service Components/PhoneButton",
    component: PhoneButton,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <PhoneButton {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    comment: "Comment about this number",
    phone_type: "phone",
    number: "(03) 3333 3333",
};

export const NoComment: typeof Template = Template.bind({});
NoComment.args = {
    phone_type: "phone type is displayed instead",
    number: "(03) 3333 3333",
};

export const LongComment: typeof Template = Template.bind({});
LongComment.args = {
    comment: "Here is a phone number with a long comment" +
        ", like, a really long comment",
    phone_type: "phone",
    number: "(03) 3333 3333",
};

export const CrisisNumber: typeof Template = Template.bind({});
CrisisNumber.args = {
    comment: "Comment about this number",
    phone_type: "phone",
    number: "(03) 3333 3333",
    crisis: true,
};
