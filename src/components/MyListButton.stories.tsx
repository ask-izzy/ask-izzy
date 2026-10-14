import type {ReactNode} from "react";
import React from "react";

import MyListButton from "./MyListButton";

export default {
    title: "App Components/MyListButton",
    component: MyListButton,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return (
        <div
            style={{
                backgroundColor: "purple",
                height: "50px",
                width: "150px",
                textAlign: "bottom",
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
            }}
        >
            <MyListButton {...args} />
        </div>
    );
};

export const Example: typeof Template = Template.bind({});
