/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import { addRouter } from "../storybook/decorators";

import NavBar from "./NavBar";

export default {
    title: "App Components/NavBar",
    component: NavBar,
    decorators: [addRouter],
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <NavBar {...args} />;
};

export const Example: typeof Template = Template.bind({});
