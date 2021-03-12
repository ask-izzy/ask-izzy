/* @flow */

import React from "react";

import DebugPersonalisation from "./DebugPersonalisation";
import { getCategory } from "../constants/categories";
import { setPersonalisationAnswers } from "../storybook/decorators";

export default {
    title: "App Components/Debug/DebugPersonalisation",
    component: DebugPersonalisation,
    decorators: [setPersonalisationAnswers],
};

const Template = (args: Object) => <DebugPersonalisation {...args} />;

export const HousingCategory = Template.bind({});
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