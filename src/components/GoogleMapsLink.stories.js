/* @flow */

import type {Node} from "React";
import React from "react";

import GoogleMapsLink from "./GoogleMapsLink";
import fixtures from "../../fixtures/services";
import Location from "../iss/Location";

export default {
    title: "Service Components/GoogleMapsLink",
    component: GoogleMapsLink,
};

const Template = (args: Object): Node => {
    (Template.args: any); return <GoogleMapsLink {...args} />;
};

export const Example: typeof Template = Template.bind({});
Example.args = {
    children: (
        <div>Link text</div>
    ),
    to: new Location(fixtures.ixa.location),
};
