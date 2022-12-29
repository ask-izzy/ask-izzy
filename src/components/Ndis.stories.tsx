import React, {ReactNode} from "react";

import Ndis from "@/src/components/Ndis.js";
import getServiceFixture from "@/fixtures/factories/Service.js";

export default {
    title: "Service Components/Ndis",
    component: Ndis
};

const Template = (args): ReactNode => {
    return <Ndis {...args} />;
};

export const Standard = Template.bind({});
Standard.args = {
    object: getServiceFixture({
        ndis_approved: true
    })
};
export const StandardWithSpacer = Template.bind({});
StandardWithSpacer.args = {
    object: getServiceFixture({
        ndis_approved: true
    }),
    spacer: true
};
export const Compact = Template.bind({});
Compact.args = {
    object: getServiceFixture({
        ndis_approved: true
    }),
    compact: true
};
export const ServiceNotNDISApproved = Template.bind({});
ServiceNotNDISApproved.args = {
    object: getServiceFixture({})
};