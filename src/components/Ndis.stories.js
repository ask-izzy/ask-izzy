/* @flow */

import React from "react";

import Ndis from "./Ndis";
import ServiceFactory from "../../fixtures/factories/Service";

export default {
    title: "Service Components/Ndis",
    component: Ndis,
};

const Template = (args: Object) => <Ndis {...args} />;

export const Standard = Template.bind({});
Standard.args = {
    object: new ServiceFactory({
        ndis_approved: true,
    }),
};

export const StandardWithSpacer = Template.bind({});
StandardWithSpacer.args = {
    object: new ServiceFactory({
        ndis_approved: true,
    }),
    spacer: true,
};

export const Compact = Template.bind({});
Compact.args = {
    object: new ServiceFactory({
        ndis_approved: true,
    }),
    compact: true,
};

export const ServiceNotNDISApproved = Template.bind({});
ServiceNotNDISApproved.args = {
    object: new ServiceFactory({
    }),
};
