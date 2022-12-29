import React, {ReactNode} from "react";

import CalloutBox from "@/src/components/CalloutBox.js";

export default {
    title: "Basic UI Components/CalloutBox",
    component: CalloutBox,
    argTypes: ({} as Record<string, any>)
};

const Template = (args): ReactNode => {
    return <CalloutBox {...args} />;
};

export const BasicText = Template.bind({});
BasicText.args = {
    position: "top",
    calloutBoxes: [{
        Top: true,
        callout: {
            Heading: "CalloutBox Title",
            ShowHeading: true,
            Body: "Body text",
            Style: {
                border: "2px solid black",
                textAlign: "center",
                width: "100%"
            }
        }
    }]
};
export const NationalHotline = Template.bind({});
NationalHotline.args = {
    position: "top",
    calloutBoxes: [{
        Top: true,
        callout: {
            Heading: "CalloutBox Title",
            ShowHeading: true,
            Body: "Body text",
            className: {
                className: "nationalHotline"
            },
            Phone: "0411 353 426"
        }
    }]
};
export const OnlineSecurityWithLink = Template.bind({});
OnlineSecurityWithLink.args = {
    position: "top",
    calloutBoxes: [{
        Top: true,
        callout: {
            Heading: "CalloutBox Title",
            ShowHeading: true,
            Body: "Body text",
            className: {
                className: "OnlineSecurity"
            },
            Link: "/"
        }
    }]
};