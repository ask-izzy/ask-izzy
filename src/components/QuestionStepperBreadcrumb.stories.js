/* @flow */

import React from "react";
import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "react";

import QuestionStepperBreadcrumb from "./QuestionStepperBreadcrumb";
import {
    setPersonalisationAnswers,
    setRouterContext,
} from "../storybook/decorators";
import LocationPage from "../pages/personalisation/Location"
import DemographicsPage from "../pages/personalisation/Demographics"

export default {
    title: "App Components/QuestionStepperBreadcrumb",
    component: QuestionStepperBreadcrumb,
    decorators: [
        setPersonalisationAnswers,
        setRouterContext,
    ],
};

type QuestionStepperBreadcrumbProps = ReactElementConfig<
    typeof QuestionStepperBreadcrumb
>

const Template = (args: QuestionStepperBreadcrumbProps): ReactNode => {
    (Template.args: QuestionStepperBreadcrumbProps);
    return <QuestionStepperBreadcrumb {...args} />;
};

export const LocationQuestion: typeof Template = Template.bind({});
LocationQuestion.args = {
    personalisationPage: LocationPage,
    personalisationPages: [LocationPage],
}
LocationQuestion.parameters = {
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

export const LocationQuestionOnLocationPage:
    typeof Template = Template.bind({});
LocationQuestionOnLocationPage.args = {
    personalisationPage: LocationPage,
    personalisationPages: [LocationPage],
}
LocationQuestionOnLocationPage.parameters = {
    context: {
        personalisationAnswers: {
            location: "Richmond, VIC",
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

export const DemographicsQuestionWithTwoAnswers:
    typeof Template = Template.bind({});
DemographicsQuestionWithTwoAnswers.args = {
    personalisationPage: DemographicsPage,
    personalisationPages: [DemographicsPage],
}
DemographicsQuestionWithTwoAnswers.parameters = {
    context: {
        personalisationAnswers: {
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

export const DemographicsQuestionWithTruncatedAnswers:
    typeof Template = Template.bind({});
DemographicsQuestionWithTruncatedAnswers.args = {
    personalisationPage: DemographicsPage,
    personalisationPages: [
        LocationPage,
        LocationPage,
        DemographicsPage,
    ],
}
DemographicsQuestionWithTruncatedAnswers.parameters = {
    context: {
        personalisationAnswers: {
            demographics: [
                "Have pets",
                "Veteran",
                "Aboriginal and/or Torres Strait Islander",
                "Couples",
                "Escaping family violence",
                "Have pets",
            ],
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

export const DemographicsQuestionWithTruncatedAnswersOnDemographicsPage:
    typeof Template = Template.bind({});
DemographicsQuestionWithTruncatedAnswersOnDemographicsPage.args = {
    personalisationPage: DemographicsPage,
    personalisationPages: [
        LocationPage,
        LocationPage,
        DemographicsPage,
    ],
}
DemographicsQuestionWithTruncatedAnswersOnDemographicsPage.parameters = {
    context: {
        personalisationAnswers: {
            demographics: [
                "Have pets",
                "Veteran",
                "Aboriginal and/or Torres Strait Islander",
                "Couples",
                "Escaping family violence",
                "Have pets",
            ],
        },
        router: {
            match: {
                params: {
                    subpage: "demographics",
                },
            },
        },
    },
}
// Example.parameters = {
//     context: {
//         personalisationAnswers: {
//             location: "Richmond, VIC",
//             "sleep-tonight": "Yes",
//             gender: "Female",
//             age: "27 to 39",
//             demographics: ["Couples", "Have pets"],
//         },
//     },
// }
