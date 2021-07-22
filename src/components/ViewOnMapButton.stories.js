/* @flow */

import type {Node} from "React";
import React from "react";

import ViewOnMapButton from "./ViewOnMapButton";
import { injectEnvVars } from "../storybook/loaders";
import { addRouter, addGoogleMapsScript } from "../storybook/decorators";

export default {
    title: "App Components/ViewOnMapButton",
    component: ViewOnMapButton,
    loaders: [injectEnvVars],
    decorators: [addRouter, addGoogleMapsScript],
};

const Template = (args: Object): Node => {
    (Template.args: any); return <ViewOnMapButton {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    to: "/",
};
