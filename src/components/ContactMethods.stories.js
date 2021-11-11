/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import ContactMethods from "./ContactMethods";
import {
    ixaService,
    phoneableService,
} from "../../fixtures/services";

export default {
    title: "Service Components/ContactMethods",
    component: ContactMethods,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ContactMethods {...args} />;
};

export const BasicService: typeof Template = Template.bind({});
BasicService.args = {
    object: ixaService,
};

export const ServiceWithLotsOfNumbers: typeof Template = Template.bind({});
ServiceWithLotsOfNumbers.args = {
    object: phoneableService,
};
