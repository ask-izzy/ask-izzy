/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import CalloutBox from "./CalloutBox";

export default {
    title: "Basic UI Components/CalloutBox",
    component: CalloutBox,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <CalloutBox {...args} />;
};

export const BasicText: typeof Template = Template.bind({});
BasicText.args = {
    position: "top",
    calloutBoxes: [
        {
            Top: true,
            callout: {
                Heading: "CalloutBox Title",
                ShowHeading: true,
                Body: "Body text",
                Style: {
                    border: "2px solid black",
                    textAlign: "center",
                    width: "100%",
                },
            },
        },
    ],
};

export const NationalHotline: typeof Template = Template.bind({});
NationalHotline.args = {
    position: "top",
    calloutBoxes: [
        {
            Top: true,
            callout: {
                Heading: "CalloutBox Title",
                ShowHeading: true,
                Body: "Body text",
                className: {
                    className: "nationalHotline",
                },
                Phone: "0411 353 426",
            },
        },
    ],
};


export const OnlineSecurityWithLink: typeof Template = Template.bind({});
OnlineSecurityWithLink.args = {
    position: "top",
    calloutBoxes: [
        {
            Top: true,
            callout: {
                Heading: "CalloutBox Title",
                ShowHeading: true,
                Body: "Body text",
                className: {
                    className: "OnlineSecurity",
                },
                Link: "/",
            },
        },
    ],
};
