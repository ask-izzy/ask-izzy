/* @flow */

import React from "react";
import { addRouter } from "../storybook/decorators";

import CrisisLineItem from "./CrisisLineItem";
import fixtures from "../../fixtures/services";
import ServiceFactory from "../../fixtures/factories/Service";

export default {
    title: "App Components/Crisis Line/CrisisLineItem",
    component: CrisisLineItem,
    decorators: [addRouter],
};

const Template = (args: Object) => <CrisisLineItem {...args} />;

export const BasicService = Template.bind({});
BasicService.args = {
    object: ServiceFactory(fixtures.ixa),
};

export const VicHousingServiceSpecialCase = Template.bind({});
VicHousingServiceSpecialCase.args = {
    object: ServiceFactory({
        ...fixtures.ixa,
        id: 2721562,
    }),
};

export const VicHousingServiceSpecialCaseExpandedByDefault = Template.bind({});
VicHousingServiceSpecialCaseExpandedByDefault.args = {
    object: ServiceFactory({
        ...fixtures.ixa,
        id: 2721562,
    }),
    expanded: true,
};

export const NSWLink2HomeServiceSpecialCase = Template.bind({});
NSWLink2HomeServiceSpecialCase.args = {
    object: ServiceFactory({
        ...fixtures.ixa,
        id: 1838208,
    }),
};
