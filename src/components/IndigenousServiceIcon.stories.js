/* @flow */

import React from "react";
import { action } from "@storybook/addon-actions";

import IndigenousServiceIcon from "./IndigenousServiceIcon";
import ServiceFactory from "../../fixtures/factories/Service";

export default {
    title: "Service Components/IndigenousServiceIcon",
    component: IndigenousServiceIcon,
    args: {
        onClick: action("clicked"),
    },
};

const Template = (args: Object) => <IndigenousServiceIcon {...args} />;

export const ServiceWithIndigenousClassification = Template.bind({});
ServiceWithIndigenousClassification.args = {
    object: new ServiceFactory({
        indigenous_classification: ["Aboriginal (indigenous) specific"],
    }),
};
export const ServiceWithoutIndigenousClassification = Template.bind({});
ServiceWithoutIndigenousClassification.args = {
    object: new ServiceFactory(),
};
