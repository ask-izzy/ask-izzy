import React, {ReactNode} from "react";
import {action} from "@storybook/addon-actions";

import getServiceFixture from "@/fixtures/factories/Service";
import IndigenousServiceIcon from "@/src/components/IndigenousServiceIcon";

export default {
    title: "Service Components/IndigenousServiceIcon",
    component: IndigenousServiceIcon,
    args: {
        onClick: (action("clicked") as any)
    }
};

const Template = (args): ReactNode => {
    return <IndigenousServiceIcon {...args} />;
};

export const ServiceWithIndigenousClassification = Template.bind({});
ServiceWithIndigenousClassification.args = {
    object: getServiceFixture({
        indigenous_classification: ["Aboriginal (indigenous) specific"]
    })
};
export const ServiceWithoutIndigenousClassification = Template.bind({});
ServiceWithoutIndigenousClassification.args = {
    object: getServiceFixture()
};