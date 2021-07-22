/* @flow */

import type {Node} from "React";
import React from "react";

import TransportTime from "./TransportTime";
import fixtures from "../../fixtures/services";
import Location from "../iss/Location";

export default {
    title: "Service Components/TransportTime",
    component: TransportTime,
    args: {
        location: (new Location(fixtures.ixa.location, [
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
        ]): Location),

    },
};

const Template = (args: Object): Node => {
    (Template.args: any); return <TransportTime {...args} />;
};

export const Compact: typeof Template = Template.bind({});
Compact.args = {
    compact: true,
};

export const Expanded: typeof Template = Template.bind({});
Expanded.args = {
    compact: false,
};
