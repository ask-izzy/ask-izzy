import type {ReactNode} from "react";
import React from "react";

import CrisisLineItem from "./CrisisLineItem";
import {ixaServiceProps} from "../../fixtures/servicesProps";
import getServiceFixture from "../../fixtures/factories/Service";

export default {
    title: "App Components/Crisis Line/CrisisLineItem",
    component: CrisisLineItem,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <CrisisLineItem {...args} />;
};

export const BasicService: typeof Template = Template.bind({});
BasicService.args = {
    service: getServiceFixture(ixaServiceProps),
};

export const VicHousingServiceSpecialCase: typeof Template = Template.bind({});
VicHousingServiceSpecialCase.args = {
    service: getServiceFixture({
        ...ixaServiceProps,
        id: 2721562,
    }),
};

export const NSWLink2HomeServiceSpecialCase: typeof Template =
    Template.bind({});
NSWLink2HomeServiceSpecialCase.args = {
    service: getServiceFixture({
        ...ixaServiceProps,
        id: 1838208,
    }),
};
