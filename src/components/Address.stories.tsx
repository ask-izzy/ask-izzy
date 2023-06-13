import React, {ReactNode} from "react";
import Address from "@/src/components/Address.js";
import AddressLocation from "@/fixtures/factories/AddressLocation.js";
export default {
    title: "Service Components/Address",
    component: Address,
    argTypes: ({} as Record<string, never>)
};

const Template = (args): ReactNode => {
    return <Address {...args} />;
};

export const ComplexLocation = Template.bind({});
ComplexLocation.args = {
    location: new (AddressLocation as any)({
        "building": "Hamy building",
        "flat_unit": "Room 35",
        "level": "Level 3",
        "postcode": "3121",
        "state": "VIC",
        "street_name": "Elizabeth",
        "street_number": "33",
        "street_suffix": "",
        "street_type": "St",
        "suburb": "RICHMOND"
    })
};
export const ConfidentialLocation = Template.bind({});
ConfidentialLocation.args = {
    location: new (AddressLocation as any)({
        "postcode": "3121",
        "state": "VIC",
        "suburb": "RICHMOND",
        "point": undefined
    })
};