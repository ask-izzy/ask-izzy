import type {ReactNode} from "react";
import React from "react";

import TransportTime from "./TransportTime";
import {
    ixaService,
} from "../../fixtures/services";

export default {
    title: "Service Components/TransportTime",
    component: TransportTime,
    args: {
        location: ixaService.location,
        travelTimes: [
            {
                mode: "DRIVING",
                duration: {text: "22 minutes", value: 1},
                distance: {text: "", value: 1},
                status: "",
            },
            {
                mode: "WALKING",
                duration: {text: "15 minutes", value: 1},
                distance: {text: "", value: 1},
                status: "",
            },
            {
                mode: "TRANSIT",
                duration: {text: "9 minutes", value: 1},
                distance: {text: "", value: 1},
                status: "",
            },
        ],
    },
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <TransportTime {...args} />;
};

export const Compact: typeof Template = Template.bind({});
Compact.args = {
    compact: true,
};

export const Expanded: typeof Template = Template.bind({});
Expanded.args = {
    compact: false,
};
