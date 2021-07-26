/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import DebugPersonalisation from "./DebugPersonalisation";
import { getCategory } from "../constants/categories";
import { setPersonalisationAnswers } from "../storybook/decorators";

export default {
    title: "App Components/Debug/DebugPersonalisation",
    component: DebugPersonalisation,
    decorators: [setPersonalisationAnswers],
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <DebugPersonalisation {...args} />;
};

export const HousingCategory: typeof Template = Template.bind({});
HousingCategory.args = {
    items: getCategory("housing")?.personalisation,
    search: getCategory("housing")?.search,
};
HousingCategory.parameters = {
    context: {
        personalisationAnswers: {
            location: "Richmond, VIC",
            "sleep-tonight": "Yes",
            gender: "Female",
            age: "27 to 39",
            demographics: ["Couples", "Have pets"],
        },
    },
};
