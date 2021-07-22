/* @flow */

import type {Node} from "React";
import React from "react";

import LgbtiqIcon from "./LgbtiqIcon";
import ServiceFactory from "../../fixtures/factories/Service";

export default {
    title: "Service Components/LgbtiqIcon",
    component: LgbtiqIcon,
};

const Template = (args: Object): Node => {
    (Template.args: any); return <LgbtiqIcon {...args} />;
};

export const ServiceFlaggedLGBTIQA: typeof Template = Template.bind({});
ServiceFlaggedLGBTIQA.args = {
    object: new ServiceFactory({
        lgbtiqa_plus_specific: true,
    }),
};

export const ServiceNotFlaggedLGBTIQA: typeof Template = Template.bind({});
ServiceNotFlaggedLGBTIQA.args = {
    object: new ServiceFactory(),
};
