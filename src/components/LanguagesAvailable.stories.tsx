import type {ReactNode} from "react";
import React from "react";

import LanguagesAvailable from "./LanguagesAvailable";
import getServiceFixture from "../../fixtures/factories/Service";

export default {
    title: "Service Components/LanguagesAvailable",
    component: LanguagesAvailable,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <LanguagesAvailable {...args} />;
};

export const LanguagesAvailableComponent: typeof Template = Template.bind({});
LanguagesAvailableComponent.args = {
    service: getServiceFixture(),
};

