import React, {ReactNode} from "react";

import CrisisLineItem from "@/src/components/CrisisLineItem";
import { ixaServiceProps } from "@/fixtures/servicesProps";
import getServiceFixture from "@/fixtures/factories/Service";

export default {
    title: "App Components/Crisis Line/CrisisLineItem",
    component: CrisisLineItem
};

const Template = (args): ReactNode => {
    return <CrisisLineItem {...args} />;
};

export const BasicService = Template.bind({});
BasicService.args = {
    object: getServiceFixture(ixaServiceProps)
};
export const VicHousingServiceSpecialCase = Template.bind({});
VicHousingServiceSpecialCase.args = {
    object: getServiceFixture({ ...ixaServiceProps,
        id: 2721562
    })
};
export const NSWLink2HomeServiceSpecialCase = Template.bind({});
NSWLink2HomeServiceSpecialCase.args = {
    object: getServiceFixture({ ...ixaServiceProps,
        id: 1838208
    })
};