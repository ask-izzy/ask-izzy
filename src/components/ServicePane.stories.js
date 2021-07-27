/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import { action } from "@storybook/addon-actions";

import ServicePane from "./ServicePane";
import ServiceFactory from "../../fixtures/factories/Service";
import fixtures from "../../fixtures/services";

export default {
    title: "Service Components/ServicePane",
    component: ServicePane,
    args: {
        onClick: (action("clicked"): any),
    },
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ServicePane {...args} />;
};

export const ISSService: typeof Template = Template.bind({});
ISSService.args = {
    service: ServiceFactory(fixtures.ixa),
};

export const YouthSupportNetService: typeof Template = Template.bind({});
YouthSupportNetService.args = {
    service: ServiceFactory(fixtures.youthSupportNet),
};
