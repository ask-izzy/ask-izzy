/* @flow */

import type {Node} from "React";
import React from "react";
import { action } from "@storybook/addon-actions";

import IndigenousServiceIcon from "./IndigenousServiceIcon";
import ServiceFactory from "../../fixtures/factories/Service";

export default {
    title: "Service Components/IndigenousServiceIcon",
    component: IndigenousServiceIcon,
    args: {
        onClick: (action("clicked"): any),
    },
};

const Template = (args: Object): Node => {
    (Template.args: any); return <IndigenousServiceIcon {...args} />;
};

export const ServiceWithIndigenousClassification: typeof Template =
    Template.bind({});
ServiceWithIndigenousClassification.args = {
    object: new ServiceFactory({
        indigenous_classification: ["Aboriginal (indigenous) specific"],
    }),
};
export const ServiceWithoutIndigenousClassification: typeof Template =
    Template.bind({});
ServiceWithoutIndigenousClassification.args = {
    object: new ServiceFactory(),
};
