/* @flow */
import BaseQuestion from "./BaseQuestion";
import icons from "../../icons";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "service-list",
    question: "What best describes what you need?",
    info: "All of your answers are private and anonymous.",
    possibleAnswers: {
        "Counselling and support": {
            serviceTypes: ["Counselling"],
        },
        "Police": {
            serviceTypes: ["Law enforcement/ Police"],
        },
        "Legal support": {
            serviceTypes: ["Legal Advice"],
        },
        "Children's support and protection": {
            serviceTypes: [
                "Child Protection/ Placement",
                "Child support advice",
            ],
        },
        "Sexual assault support": {
            serviceTypes: [
                "Sexual Assault Services",
                "Incest/sexual abuse counselling",
            ],
        },
        "Help for people using violence": {
            serviceTypes: [
                "Domestic violence counselling",
            ],
        },
        "Emergency accommodation": {
            serviceTypes: [
                "Emergency financial assistance for accommodation",
                "Refuge/ Crisis accommodation",
            ],
        },
        "Help with pets": {
            serviceTypes: ["Animal Welfare"],
        },
    },
    icons: {
        "Counselling and support": icons.Support,
        "Police": icons.Police,
        "Legal support": icons.Legal,
        "Children's support and protection": icons.DemographicChildren,
        "Sexual assault support": icons.SexualViolence,
        "Help for people using violence": icons.UsingViolence,
        "Emergency accommodation": icons.House,
        "Help with pets": icons.DemographicPets,
    },
    descriptionsForAnswers: {
        "Counselling and support": "Someone to talk to.",
        "Police": "Stations and liason officers.",
        "Legal support": "Intervention orders, court and separation.",
        "Children's support and protection":
            "Support services and child protection.",
        "Sexual assault support": "Counselling, medical care and support.",
        "Help for people using violence":
            "Counselling & behaviour change programs.",
        "Emergency accommodation": "Need a place to stay.",
        "Help with pets": "Shelter or assistance for pets.",
    },
    showSupportSearchBar: true,
}

export default class DVFSubcategories extends BaseQuestion {
    static title: string = "Services";

    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Help for people using violence":
            return "Behavioural support";
        case "Help for pets":
            return "Help with pets";
        default:
            return answer
        }
    }
}
