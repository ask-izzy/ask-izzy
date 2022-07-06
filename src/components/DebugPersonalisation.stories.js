/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import DebugPersonalisation from "./DebugPersonalisation";
import { getCategory } from "../constants/categories";
import {
    setPersonalisationAnswers,
    setDebugModeContext,
} from "../storybook/decorators";

export default {
    title: "Debug Components/DebugPersonalisation",
    component: DebugPersonalisation,
    decorators: [
        setPersonalisationAnswers,
        setDebugModeContext,
    ],
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <DebugPersonalisation {...args} />;
};

export const HousingCategory: typeof Template = Template.bind({});
HousingCategory.args = {
    issQuery: getCategory("housing")?.searchQueryChanges,
    setIssParamsOverride: () => {},
};
HousingCategory.parameters = {
    context: {
        debugMode: true,
        personalisationAnswers: {
            location: "Richmond, VIC",
            "sleep-tonight": "Yes",
            gender: "Female",
            age: "27 to 39",
            demographics: ["Couples", "Have pets"],
        },
        router: {
            match: {
                params: {
                    page: "housing",
                },
            },
        },
    },
};
