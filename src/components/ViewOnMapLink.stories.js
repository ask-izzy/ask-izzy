/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import ViewOnMapLink from "./ViewOnMapLink";
import { injectEnvVars } from "../storybook/loaders";
import { addGoogleMapsScript } from "../storybook/decorators";

export default {
    title: "App Components/ViewOnMapLink",
    component: ViewOnMapLink,
    loaders: [injectEnvVars],
    decorators: [addGoogleMapsScript],
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ViewOnMapLink {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    to: "/",
};
