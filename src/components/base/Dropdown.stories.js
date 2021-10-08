/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import Dropdown from "./Dropdown";


export default {
    title: "Basic UI Components/Dropdown",
    component: Dropdown,
    args: {
        selection: {
            key: "",
            value: "",
            name: "Best match",
        },
        title: "Dropdown",
        options: [
            {
                key: "",
                value: "",
                name: "Best match",
            },
            {
                key: "now_open",
                value: {now_open: true},
                name: "Open now",
            },
        ],
    },
    argTypes: {
        title: {
            control: {type: "text"},
        },
    },
};

const Template = (args: Object): ReactNode => <Dropdown {...args} />;

export const Example: typeof Template = Template.bind({});