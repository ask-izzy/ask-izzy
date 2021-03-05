/* @flow */

import React from "react";
import Address from "./Address";
import Location from "../../fixtures/factories/Location";

export default {
    title: "Service Components/Address",
    component: Address,
    argTypes: {},
};

const Template = (args: Object) => <Address {...args} />;

export const ComplexLocation = Template.bind({});
ComplexLocation.args = {
    location: new Location({
        "building": "Hamy building",
        "flat_unit": "Room 35",
        "level": "Level 3",
        "postcode": "3121",
        "state": "VIC",
        "street_name": "Elizabeth",
        "street_number": "33",
        "street_suffix": "",
        "street_type": "St",
        "suburb": "RICHMOND",
    }),
};

export const ConfidentialLocation = Template.bind({});
ConfidentialLocation.args = {
    location: new Location({
        "postcode": "3121",
        "state": "VIC",
        "suburb": "RICHMOND",
        "point": undefined,
    }),
};