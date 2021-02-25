import React from "react";
import FlatButton from "./FlatButton";

export default {
    title: "Basic UI Components/FlatButton",
    component: FlatButton,
};

const Template = (args) => <FlatButton {...args} />;

export const BasicButton = Template.bind({});
BasicButton.args = {
    label: "Example Button",
};