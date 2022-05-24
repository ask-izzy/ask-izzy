/* @flow */

import React from "react";
import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "react";

import QuestionStepper from "./QuestionStepper";
import {
    setPersonalisationAnswers,
} from "../storybook/decorators";

export default {
    title: "App Components/QuestionStepper",
    component: QuestionStepper,
    decorators: [
        setPersonalisationAnswers,
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
                    page: "housing",
                },
            },
        },
    },
}

export const HousingFlowEditingLocation: typeof Template = Template.bind({});
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
                    page: "housing",
                    subpage: "location",
                },
            },
        },
    },
}

export const ShowEditAnswers: typeof Template = Template.bind({});
ShowEditAnswers.args = {
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
                    page: "housing",
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
                    page: "housing",
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
