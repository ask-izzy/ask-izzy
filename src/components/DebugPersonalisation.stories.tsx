import React, {ReactNode} from "react";

import DebugPersonalisation from "@/src/components/DebugPersonalisation.js";
import {getCategory} from "@/src/constants/categories.js";

import { setPersonalisationAnswers, setDebugModeContext } from "../storybook/decorators.js";
export default {
    title: "Debug Components/DebugPersonalisation",
    component: DebugPersonalisation,
    decorators: [setPersonalisationAnswers, setDebugModeContext]
};

const Template = (args): ReactNode => {
    return <DebugPersonalisation {...args} />;
};

export const HousingCategory = Template.bind({});
HousingCategory.args = {
    issQuery: getCategory("housing")?.searchQueryChanges,
    setIssParamsOverride: () => undefined
};
HousingCategory.parameters = {
    context: {
        debugMode: true,
        personalisationAnswers: {
            location: "Richmond, VIC",
            "sleep-tonight": "Yes",
            gender: "Female",
            age: "27 to 39",
            demographics: ["Couples", "Have pets"]
        },
        router: {
            match: {
                params: {
                    page: "housing"
                }
            }
        }
    }
};