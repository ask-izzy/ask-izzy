import React from "react";
import Address from "./Address";
import Location from "../iss/Location";

export default {
    title: "Service Components/Address",
    component: Address,
    argTypes: {},
    parameters: {
        backgrounds: {
            default: "White",
            values: [
                { name: "White", value: "#fff" },
            ],
        },
    },
};

const Template = (args) => <Address {...args} />;

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
        "point": {},
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