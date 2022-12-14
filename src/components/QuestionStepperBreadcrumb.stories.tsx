import React, {ReactNode} from "react";

import QuestionStepperBreadcrumb from "@/src/components/QuestionStepperBreadcrumb";
import { setPersonalisationAnswers } from "@/src/storybook/decorators";
import LocationPage from "@/src/constants/personalisation-pages/Location";
import DemographicsPage from "@/src/constants/personalisation-pages/Demographics";

export default {
    title: "App Components/QuestionStepperBreadcrumb",
    component: QuestionStepperBreadcrumb,
    decorators: [setPersonalisationAnswers]
};

const Template = (args): ReactNode => {
    return <QuestionStepperBreadcrumb {...args} />;
};

export const LocationQuestion = Template.bind({});
LocationQuestion.args = {
    personalisationPage: LocationPage,
    personalisationPages: [LocationPage]
};
LocationQuestion.parameters = {
    context: {
        personalisationAnswers: {
            location: "Richmond, VIC"
        },
        router: {
            match: {
                params: {
                    subpage: "other-page"
                }
            }
        }
    }
};
export const LocationQuestionOnLocationPage = Template.bind({});
LocationQuestionOnLocationPage.args = {
    personalisationPage: LocationPage,
    personalisationPages: [LocationPage]
};
LocationQuestionOnLocationPage.parameters = {
    context: {
        personalisationAnswers: {
            location: "Richmond, VIC"
        },
        router: {
            match: {
                params: {
                    subpage: "location"
                }
            }
        }
    }
};
export const DemographicsQuestionWithTwoAnswers = Template.bind({});
DemographicsQuestionWithTwoAnswers.args = {
    personalisationPage: DemographicsPage,
    personalisationPages: [DemographicsPage]
};
DemographicsQuestionWithTwoAnswers.parameters = {
    context: {
        personalisationAnswers: {
            demographics: ["Couples", "Have pets"]
        },
        router: {
            match: {
                params: {
                    subpage: "other-page"
                }
            }
        }
    }
};
export const DemographicsQuestionWithTruncatedAnswers = Template.bind({});
DemographicsQuestionWithTruncatedAnswers.args = {
    personalisationPage: DemographicsPage,
    personalisationPages: [LocationPage, LocationPage, DemographicsPage]
};
DemographicsQuestionWithTruncatedAnswers.parameters = {
    context: {
        personalisationAnswers: {
            demographics: [
                "Have pets",
                "Veteran",
                "Aboriginal and/or Torres Strait Islander",
                "Couples",
                "Escaping family violence",
                "Have pets"
            ]
        },
        router: {
            match: {
                params: {
                    subpage: "other-page"
                }
            }
        }
    }
};
export const DemographicsQuestionWithTruncatedAnswersOnDemographicsPage = Template.bind({});
DemographicsQuestionWithTruncatedAnswersOnDemographicsPage.args = {
    personalisationPage: DemographicsPage,
    personalisationPages: [LocationPage, LocationPage, DemographicsPage]
};
DemographicsQuestionWithTruncatedAnswersOnDemographicsPage.parameters = {
    context: {
        personalisationAnswers: {
            demographics: [
                "Have pets",
                "Veteran",
                "Aboriginal and/or Torres Strait Islander",
                "Couples",
                "Escaping family violence",
                "Have pets"
            ]
        },
        router: {
            match: {
                params: {
                    subpage: "demographics"
                }
            }
        }
    }
};