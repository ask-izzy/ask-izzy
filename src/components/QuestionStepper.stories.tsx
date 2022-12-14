import React, {ReactNode} from "react";

import QuestionStepper from "@/src/components/QuestionStepper";
import { setPersonalisationAnswers } from "@/src/storybook/decorators";

export default {
    title: "App Components/QuestionStepper",
    component: QuestionStepper,
    decorators: [setPersonalisationAnswers]
};

const Template = (args): ReactNode => {
    return <QuestionStepper {...args} />;
};

export const HousingFlow = Template.bind({});
HousingFlow.parameters = {
    context: {
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
                    subpage: "other-page",
                    page: "housing"
                }
            }
        }
    }
};
export const HousingFlowEditingLocation = Template.bind({});
HousingFlowEditingLocation.parameters = {
    context: {
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
                    page: "housing",
                    subpage: "location"
                }
            }
        }
    }
};
export const ShowEditAnswers = Template.bind({});
ShowEditAnswers.args = {
    showEditAnswers: true
};
ShowEditAnswers.parameters = {
    context: {
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
                    page: "housing",
                    subpage: "other-page"
                }
            },
            location: {
                pathname: "/"
            }
        }
    }
};
export const ShowPageIcons = Template.bind({});
ShowPageIcons.args = {
    showQuestionIcons: true
};
ShowPageIcons.parameters = {
    context: {
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
                    page: "housing",
                    subpage: "other-page"
                }
            }
        }
    }
};
export const WithClearLocation = Template.bind({});
WithClearLocation.args = {
    showClearLocation: true
};
WithClearLocation.parameters = {
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