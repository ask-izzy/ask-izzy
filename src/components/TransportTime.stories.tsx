import React, {ReactNode} from "react";

import TransportTime from "@/src/components/TransportTime";
import { ixaService } from "@/fixtures/services";

export default {
    title: "Service Components/TransportTime",
    component: TransportTime,
    args: {
        location: ixaService.location,
        travelTimes: [{
            mode: "DRIVING",
            duration: {
                text: "22 minutes",
                value: 1
            },
            distance: {
                text: "",
                value: 1
            },
            status: ""
        }, {
            mode: "WALKING",
            duration: {
                text: "15 minutes",
                value: 1
            },
            distance: {
                text: "",
                value: 1
            },
            status: ""
        }, {
            mode: "TRANSIT",
            duration: {
                text: "9 minutes",
                value: 1
            },
            distance: {
                text: "",
                value: 1
            },
            status: ""
        }]
    }
};

const Template = (args): ReactNode => {
    return <TransportTime {...args} />;
};

export const Compact = Template.bind({});
Compact.args = {
    compact: true
};
export const Expanded = Template.bind({});
Expanded.args = {
    compact: false
};