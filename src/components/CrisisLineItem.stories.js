/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import CrisisLineItem from "./CrisisLineItem";
import fixtures from "../../fixtures/services";
import ServiceFactory from "../../fixtures/factories/Service";

export default {
    title: "App Components/Crisis Line/CrisisLineItem",
    component: CrisisLineItem,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <CrisisLineItem {...args} />;
};

export const BasicService: typeof Template = Template.bind({});
BasicService.args = {
    object: ServiceFactory(fixtures.ixa),
};

export const VicHousingServiceSpecialCase: typeof Template = Template.bind({});
VicHousingServiceSpecialCase.args = {
    object: ServiceFactory({
        ...fixtures.ixa,
        id: 2721562,
    }),
};

export const NSWLink2HomeServiceSpecialCase: typeof Template =
    Template.bind({});
NSWLink2HomeServiceSpecialCase.args = {
    object: ServiceFactory({
        ...fixtures.ixa,
        id: 1838208,
    }),
};
