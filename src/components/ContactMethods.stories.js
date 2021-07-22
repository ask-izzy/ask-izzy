/* @flow */

import type {Node} from "React";
import React from "react";

import ContactMethods from "./ContactMethods";
import fixtures from "../../fixtures/services";
import ServiceFactory from "../../fixtures/factories/Service";
import { addRouter } from "../storybook/decorators";

export default {
    title: "Service Components/ContactMethods",
    component: ContactMethods,
    decorators: [addRouter],
};

const Template = (args: Object): Node => {
    (Template.args: any); return <ContactMethods {...args} />;
};

export const BasicService: typeof Template = Template.bind({});
BasicService.args = {
    object: ServiceFactory(fixtures.ixa),
};

export const ServiceWithLotsOfNumbers: typeof Template = Template.bind({});
ServiceWithLotsOfNumbers.args = {
    object: ServiceFactory(fixtures.phoneableService),
};
