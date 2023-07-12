/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import LanguagesAvailable from "./LanguagesAvailable";
import getServiceFixture from "../../fixtures/factories/Service";

export default {
    title: "Service Components/LanguagesAvailable",
    component: LanguagesAvailable,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <LanguagesAvailable {...args} />;
};

export const LanguagesAvailableComponent: typeof Template = Template.bind({});
LanguagesAvailableComponent.args = {
    service: getServiceFixture(),
};

