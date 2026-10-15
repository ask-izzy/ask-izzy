import type {ReactNode} from "react";
import React from "react";

import LgbtiqIcon from "./LgbtiqIcon";
import getServiceFixture from "../../fixtures/factories/Service";

export default {
    title: "Service Components/LgbtiqIcon",
    component: LgbtiqIcon,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <LgbtiqIcon {...args} />;
};

export const ServiceFlaggedLGBTIQA: typeof Template = Template.bind({});
ServiceFlaggedLGBTIQA.args = {
    object: getServiceFixture({
        is_lgbtiqa_plus_specific: true,
    }),
};

export const ServiceNotFlaggedLGBTIQA: typeof Template = Template.bind({});
ServiceNotFlaggedLGBTIQA.args = {
    object: getServiceFixture(),
};
