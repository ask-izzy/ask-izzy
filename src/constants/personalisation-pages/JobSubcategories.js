/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"

export default ({
    type: "question",
    name: "work-and-learning-subcategory",
    question: "Where do you want to start?",
    possibleAnswers: {
        "Finding a job": {
            serviceTypes: [
                "Employment",
            ],
            $concat: {
                term: [
                    "-\"support for business\"",
                    "-\"vocation rehabilitation\"",
                    "-\"workplace relations\"",
                    "jobs",
                ],
            },
            $removeElms: {
                term: [
                    "education",
                ],
            },
        },
        "Supported employment": {
            serviceTypes: [
                "Employment",
                "Supported Employment",
            ],
            $concat: {
                term: [
                    "job",
                    "searching",
                ],
            },
            $removeElms: {
                term: [
                    "employment",
                    "education",
                    "-chsp",
                    "-hacc",
                ],
            },
        },
        "Education": {
            serviceTypes: ["Education"],
            $removeElms: {
                term: [
                    "employment",
                ],
            },
        },
        "Community skills training": {
            serviceTypes: ["Adult and Community Education"],
            $concat: {
                term: [
                    "training",
                ],
            },
            $removeElms: {
                term: [
                    "employment",
                ],
            },
        },
        "Volunteering": {
            $unset: ["serviceTypes"],
            $concat: {
                term: [
                    "-grant",
                    "volunteer",
                ],
            },
            $removeElms: {
                term: [
                    "employment",
                    "education",
                ],
            },
        },
        "Libraries": {
            serviceTypes: ["Libraries"],
            term: ["library"],
        },
        "Things to do": {
            serviceTypesRaw: ["Recreation and leisure"],
            serviceTypes: [],
            $concat: {
                term: [
                    "recreation",
                    "social",
                ],
            },
            $removeElms: {
                term: [
                    "employment",
                    "education",
                ],
            },
        },
    },
    descriptionsForAnswers: {
        "Finding a job": "Employment programs and services",
        "Supported employment":
            "Employment services for people with additional needs",
        "Education": "Schools and other centers for learning",
        "Community skills training":
            "Local programs such as parenting, computer, or other skills",
        "Volunteering": "Places to help and gain experience",
        "Libraries": "Access to computers, books and information",
        "Things to do": "Social and recreational activities",
    },
    showSupportSearchBar: true,
    title: "Jobs",
}: PersonalisationPage)
