/* @flow */

import React from "react";
import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "react";

import QuestionStepper from "./QuestionStepper";
import {
    setPersonalisationAnswers,
    setRouterContext,
} from "../storybook/decorators";
import {getCategory} from "../constants/categories";

export default {
    title: "App Components/QuestionStepper",
    component: QuestionStepper,
    decorators: [
        setPersonalisationAnswers,
        setRouterContext,
    ],
};

type QuestionStepperProps = ReactElementConfig<
    typeof QuestionStepper
>

const Template = (args: QuestionStepperProps): ReactNode => {
    (Template.args: QuestionStepperProps);
    return <QuestionStepper {...args} />;
};

export const HousingFlow: typeof Template = Template.bind({});
HousingFlow.args = {
    category: getCategory("housing"),
}
HousingFlow.parameters = {
    context: {
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
                    subpage: "other-page",
                },
            },
        },
    },
}

export const HousingFlowEditingLocation: typeof Template = Template.bind({});
HousingFlowEditingLocation.args = {
    category: getCategory("housing"),
}
HousingFlowEditingLocation.parameters = {
    context: {
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
                    subpage: "location",
                },
            },
        },
    },
}

export const ShowEditAnswers: typeof Template = Template.bind({});
ShowEditAnswers.args = {
    category: getCategory("housing"),
    showEditAnswers: true,
}
ShowEditAnswers.parameters = {
    context: {
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
                    subpage: "other-page",
                },
            },
            location: {
                pathname: "/",
            },
        },
    },
}

export const ShowPageIcons: typeof Template = Template.bind({});
ShowPageIcons.args = {
    category: getCategory("housing"),
    showQuestionIcons: true,
}
ShowPageIcons.parameters = {
    context: {
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
                    subpage: "other-page",
                },
            },
        },
    },
}

export const WithClearLocation: typeof Template = Template.bind({});
WithClearLocation.args = {
    showClearLocation: true,
}
WithClearLocation.parameters = {
    context: {
        personalisationAnswers: {
            location: "Richmond, VIC",
        },
        router: {
            match: {
                params: {
                    subpage: "other-page",
                },
            },
        },
    },
}
