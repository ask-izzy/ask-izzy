/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import Ndis from "./Ndis";
import getServiceFixture from "../../fixtures/factories/Service";

export default {
    title: "Service Components/Ndis",
    component: Ndis,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <Ndis {...args} />;
};

export const Standard: typeof Template = Template.bind({});
Standard.args = {
    object: getServiceFixture({
        ndis_approved: true,
    }),
};

export const StandardWithSpacer: typeof Template = Template.bind({});
StandardWithSpacer.args = {
    object: getServiceFixture({
        ndis_approved: true,
    }),
    spacer: true,
};

export const Compact: typeof Template = Template.bind({});
Compact.args = {
    object: getServiceFixture({
        ndis_approved: true,
    }),
    compact: true,
};

export const ServiceNotNDISApproved: typeof Template = Template.bind({});
ServiceNotNDISApproved.args = {
    object: getServiceFixture({
    }),
};
