/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import ViewOnMapLink from "./ViewOnMapLink";
import { addGoogleMapsScript } from "../storybook/decorators";

export default {
    title: "App Components/ViewOnMapLink",
    component: ViewOnMapLink,
    decorators: [addGoogleMapsScript],
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ViewOnMapLink {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    to: "/",
};
