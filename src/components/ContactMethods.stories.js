/* @flow */

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

const Template = (args: Object) => <ContactMethods {...args} />;

export const BasicService = Template.bind({});
BasicService.args = {
    object: ServiceFactory(fixtures.ixa),
};

export const OtherDetailsExpandedByDefault = Template.bind({});
OtherDetailsExpandedByDefault.args = {
    object: ServiceFactory(fixtures.ixa),
    expanded: true,
};

export const ServiceWithLotsOfNumbers = Template.bind({});
ServiceWithLotsOfNumbers.args = {
    object: ServiceFactory(fixtures.phoneableService),
};
