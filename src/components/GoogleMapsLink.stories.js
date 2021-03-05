/* @flow */

import React from "react";

import GoogleMapsLink from "./GoogleMapsLink";
import fixtures from "../../fixtures/services";
import Location from "../iss/Location";

export default {
    title: "Service Components/GoogleMapsLink",
    component: GoogleMapsLink,
};

const Template = (args: Object) => <GoogleMapsLink {...args} />;

export const Example = Template.bind({});
Example.args = {
    children: (
        <div>Link text</div>
    ),
    to: new Location(fixtures.ixa.location),
};
