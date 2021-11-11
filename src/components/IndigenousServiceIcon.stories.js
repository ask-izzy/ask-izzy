/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import { action } from "@storybook/addon-actions";

import IndigenousServiceIcon from "./IndigenousServiceIcon";
import getServiceFixture from "../../fixtures/factories/Service";

export default {
    title: "Service Components/IndigenousServiceIcon",
    component: IndigenousServiceIcon,
    args: {
        onClick: (action("clicked"): any),
    },
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <IndigenousServiceIcon {...args} />;
};

export const ServiceWithIndigenousClassification: typeof Template =
    Template.bind({});
ServiceWithIndigenousClassification.args = {
    object: getServiceFixture({
        indigenous_classification: ["Aboriginal (indigenous) specific"],
    }),
};
export const ServiceWithoutIndigenousClassification: typeof Template =
    Template.bind({});
ServiceWithoutIndigenousClassification.args = {
    object: getServiceFixture(),
};
