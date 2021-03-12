/* @flow */

import React from "react";
import { action } from "@storybook/addon-actions";

import ServicePane from "./ServicePane";
import ServiceFactory from "../../fixtures/factories/Service";
import fixtures from "../../fixtures/services";
import { addRouter } from "../storybook/decorators";

export default {
    title: "Service Components/ServicePane",
    component: ServicePane,
    args: {
        onClick: action("clicked"),
    },
    decorators: [addRouter],
};

const Template = (args: Object) => <ServicePane {...args} />;

export const ISSService = Template.bind({});
ISSService.args = {
    service: ServiceFactory(fixtures.ixa),
};

export const YouthSupportNetService = Template.bind({});
YouthSupportNetService.args = {
    service: ServiceFactory(fixtures.youthSupportNet),
};
