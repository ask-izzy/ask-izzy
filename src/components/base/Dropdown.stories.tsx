import React, {ReactNode} from "react";

import Dropdown from "@/src/components/base/Dropdown.js";

export default {
    title: "Basic UI Components/Dropdown",
    component: Dropdown,
    args: {
        selection: {
            key: "",
            value: "",
            name: "Best match"
        },
        title: "Dropdown",
        options: [{
            key: "",
            value: "",
            name: "Best match"
        }, {
            key: "now_open",
            value: {
                now_open: true
            },
            name: "Open now"
        }]
    },
    argTypes: {
        title: {
            control: {
                type: "text"
            }
        }
    }
};

const Template = (args): ReactNode => <Dropdown {...args} />;

export const Example = Template.bind({});