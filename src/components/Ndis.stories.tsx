import type {ReactNode} from "react";
import React from "react";

import Ndis from "./Ndis";
import getServiceFixture from "../../fixtures/factories/Service";

export default {
    title: "Service Components/Ndis",
    component: Ndis,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <Ndis {...args} />;
};

export const Standard: typeof Template = Template.bind({});
Standard.args = {
    object: getServiceFixture({
        is_ndis_approved: true,
    }),
};

export const StandardWithSpacer: typeof Template = Template.bind({});
StandardWithSpacer.args = {
    object: getServiceFixture({
        is_ndis_approved: true,
    }),
    withSpacer: true,
};

export const Compact: typeof Template = Template.bind({});
Compact.args = {
    object: getServiceFixture({
        is_ndis_approved: true,
    }),
    compact: true,
};

export const ServiceNotNDISApproved: typeof Template = Template.bind({});
ServiceNotNDISApproved.args = {
    object: getServiceFixture({
    }),
};
