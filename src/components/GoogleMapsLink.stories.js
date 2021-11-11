/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import GoogleMapsLink from "./GoogleMapsLink";
import {ixaService} from "../../fixtures/services";

export default {
    title: "Service Components/GoogleMapsLink",
    component: GoogleMapsLink,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <GoogleMapsLink {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    children: (
        <div>Link text</div>
    ),
    to: ixaService.location,
};
