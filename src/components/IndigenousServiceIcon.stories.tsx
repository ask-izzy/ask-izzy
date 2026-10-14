import type {ReactNode} from "react";
import React from "react";
import { action } from "@storybook/addon-actions";

import IndigenousServiceIcon from "./IndigenousServiceIcon";
import getServiceFixture from "../../fixtures/factories/Service";

export default {
    title: "Service Components/IndigenousServiceIcon",
    component: IndigenousServiceIcon,
    args: {
        onClick: (action("clicked") as any),
    },
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <IndigenousServiceIcon {...args} />;
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
