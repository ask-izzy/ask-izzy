import type {
    PersonalisationPage,
} from "@/types/personalisation-page"

export default ({
    type: "question",
    name: "support-and-counselling-subcategory",
    question: "What issues are you dealing with?",
    possibleAnswers: {
        "Mental and emotional health": {
            serviceTypes: ["Mental health"],
            term: [
                "-\"coordinating bodies\"",
                "\"mental health\"",
            ],
        },
        "Emergency support": {
            $concat: {
                term: ["crisis"],
            },
            serviceTypes: ["Crisis counselling"],
        },
        "Family or relationships": {
            $concat: {
                term: ["family", "relationship"],
            },
            serviceTypes: ["Relationship Assistance"],
        },
        "Drugs and alcohol counselling": {
            term: ["drugs", "alcohol"],
            serviceTypes: ["Alcohol & Other Drug Counselling"],
        },
        "Gender or sexual identity": {
            $unset: ["serviceTypes"],
            $concat: {
                term: ["sexuality"],
            },
        },
        "Homelessness support": {
            $unset: ["serviceTypes"],
            $concat: {
                term: [
                    "-\"coordinating bodies\"",
                    "-\"respite care\"",
                    "-hef -\"holiday accommodation\"",
                    "\"homelessness support\"",
                ],
            },
            $removeElms: {
                term: [
                    "counselling",
                ],
            },
        },

        "Sexual assault or family violence": {
            serviceTypes: [
                "Incest/sexual abuse counselling",
                "Domestic violence counselling",
            ],
        },
        "Gambling counselling": {
            $concat: {
                term: ["gambling"],
            },
            serviceTypes: ["Gambling Counselling"],
        },
    },
    showSupportSearchBar: true,
    descriptionsForAnswers: {
        "Mental and emotional health": "Help with anxiety, depression and mental health",
        "Emergency support": "Urgent help in a mental health crisis",
        "Family or relationships": "Counselling for healthy and safe relationships",
        "Drugs and alcohol counselling": "Support with addiction and substance use",
        "Gender or sexual identity": "Support, mental health and safety",
        "Homelessness support": "Help for people experiencing homelessness",
        "Sexual assault or family violence": "Support for current or past experiences of violence",
        "Gambling counselling": "Someone to talk to about gambling",
    },
    title: "Counselling services",
    resetDfvOptionsOnDisplay: true,
} as PersonalisationPage)
