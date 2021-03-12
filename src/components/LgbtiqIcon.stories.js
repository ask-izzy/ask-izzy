/* @flow */

import React from "react";

import LgbtiqIcon from "./LgbtiqIcon";
import ServiceFactory from "../../fixtures/factories/Service";

export default {
    title: "Service Components/LgbtiqIcon",
    component: LgbtiqIcon,
};

const Template = (args: Object) => <LgbtiqIcon {...args} />;

export const ServiceFlaggedLGBTIQA = Template.bind({});
ServiceFlaggedLGBTIQA.args = {
    object: new ServiceFactory({
        lgbtiqa_plus_specific: true,
    }),
};

export const ServiceNotFlaggedLGBTIQA = Template.bind({});
ServiceNotFlaggedLGBTIQA.args = {
    object: new ServiceFactory(),
};