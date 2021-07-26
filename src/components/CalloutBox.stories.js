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
                Heading: "Accordion Title",
                Body: "Test",
                Style: {
                    border: "2px solid black",
                    textAlign: "center",
                    width: "100%",
                },
            },
        },
    ],
};
