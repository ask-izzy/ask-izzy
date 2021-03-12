/* @flow */

import React from "react";
import { addRouter } from "../storybook/decorators";

import NavBar from "./NavBar";

export default {
    title: "App Components/NavBar",
    component: NavBar,
    decorators: [addRouter],
};

const Template = (args: Object) => <NavBar {...args} />;

export const Example = Template.bind({});