/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import Address from "./Address";
import AddressLocation from "../../fixtures/factories/AddressLocation";

export default {
    title: "Service Components/Address",
    component: Address,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <Address {...args} />;
};

export const ComplexLocation: typeof Template = Template.bind({});
ComplexLocation.args = {
    location: new AddressLocation({
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

export const ConfidentialLocation: typeof Template = Template.bind({});
ConfidentialLocation.args = {
    location: new AddressLocation({
        "postcode": "3121",
        "state": "VIC",
        "suburb": "RICHMOND",
        "point": undefined,
    }),
};
