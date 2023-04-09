import React, {ReactNode} from "react";

import LgbtiqIcon from "@/src/components/LgbtiqIcon.js";
import getServiceFixture from "@/fixtures/factories/Service.js";


export default {
    title: "Service Components/LgbtiqIcon",
    component: LgbtiqIcon
};

const Template = (args): ReactNode => {
    return <LgbtiqIcon {...args} />;
};

export const ServiceFlaggedLGBTIQA = Template.bind({});
ServiceFlaggedLGBTIQA.args = {
    object: getServiceFixture({
        lgbtiqa_plus_specific: true
    })
};
export const ServiceNotFlaggedLGBTIQA = Template.bind({});
ServiceNotFlaggedLGBTIQA.args = {
    object: getServiceFixture()
};