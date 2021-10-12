/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import Accessibility from "./Accessibility";
import getServiceFixture from "../../fixtures/factories/Service";
import {susansHouseServiceProps} from "../../fixtures/servicesProps"

export default {
    title: "Service Components/Accessibility",
    component: Accessibility,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <Accessibility {...args} />
};

export const ServiceWithFullAccess: typeof Template = Template.bind({});
ServiceWithFullAccess.args = {
    service: getServiceFixture(
        {...susansHouseServiceProps, accessibility: "fullaccess"}
    ),
};

export const ServiceWithAccess: typeof Template = Template.bind({});
ServiceWithAccess.args = {
    service: getServiceFixture(
        {...susansHouseServiceProps, accessibility: "access"}
    ),
};

export const ServiceWithNoAccess: typeof Template = Template.bind({});
ServiceWithNoAccess.args = {
    object: getServiceFixture(
        {...susansHouseServiceProps, accessibility: "noaccess"}
    ),
};
