import React, {ReactNode} from "react";

import MyListButton from "@/src/components/MyListButton.js";


export default {
    title: "App Components/MyListButton",
    component: MyListButton
};

const Template = (args: Record<string, any>): ReactNode => {
    return (
        <div
            style={{
                backgroundColor: "purple",
                height: "50px",
                width: "150px",
                display: "flex",
                alignContent: "center",
                justifyContent: "center"
            }}
        >
            <MyListButton {...args} />
        </div>
    )
};

export const Example: typeof Template = Template.bind({});