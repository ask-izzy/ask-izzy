import React, {ReactNode} from "react";

import PhoneButton from "@/src/components/PhoneButton.js";

export default {
    title: "Service Components/PhoneButton",
    component: PhoneButton
};

const Template = (args): ReactNode => {
    return <PhoneButton {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    comment: "Comment about this number",
    kind: "phone",
    number: "(03) 3333 3333"
};
export const NoComment = Template.bind({});
NoComment.args = {
    kind: "kind is displayed instead",
    number: "(03) 3333 3333"
};
export const LongComment = Template.bind({});
LongComment.args = {
    comment: "Here is a phone number with a long comment, like, a really long comment",
    kind: "phone",
    number: "(03) 3333 3333"
};
export const CrisisNumber = Template.bind({});
CrisisNumber.args = {
    comment: "Comment about this number",
    kind: "phone",
    number: "(03) 3333 3333",
    crisis: true
};