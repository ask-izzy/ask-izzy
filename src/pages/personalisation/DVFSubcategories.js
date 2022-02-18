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
        "Family violence support": {},
        "Counselling": {
            $concat: {
                term: ["counselling"],
            },
        },
        "Police": {
            $concat: {
                term: ["police", "dvlo"],
            },
            $removeElms: {
                term: ["(family violence)"],
            },
        },
        "Legal support": {
            $concat: {
                term: [
                    "legal",
                    "-permits",
                    "-ceremonies",
                    "-making",
                    "-checks",
                    "-electoral",
                    "-taxation",
                    "-centrelink",
                    "-immigration",
                    "-(hire of facilities)",
                    "-police",
                ],
            },
        },
        "Children's support & protection": {
            $concat: {
                term: ["service_type:Child Protection/ Placement"],
            },
            $removeElms: {
                term: ["(family violence)"],
            },
        },
        "Sexual assault support": {
            $concat: {
                term: ["(sexual assault)"],
            },
            $removeElms: {
                term: ["(family violence)"],
            },
        },
        "Financial help": {
            $concat: {
                term: [
                    "(financial counselling)",
                    "-grants",
                    "name:\"financial counselling\"",
                ],
            },
            $removeElms: {
                term: ["(family violence)"],
            },
        },
        "Help for people using violence": {
            $concat: {
                term: ["(using violence)"],
            },
            $removeElms: {
                term: ["(family violence)"],
            },
            $applyIfShouldInjectAccessPoints: {
                $concat: {
                    term: ["(men's behaviour change)"],
                },
                $removeElms: {
                    term: ["(using violence)"],
                },
            },
        },
        "Help for pets": {
            $concat: {
                term: [
                    "pets",
                    "-(animal control)",
                    "-(effectiveness training)",
                ],
            },
        },
    },
    icons: {
        "Family violence support": icons.ExperiencingViolence,
        "Counselling": icons.Support,
        "Police": icons.Police,
        "Legal support": icons.Legal,
        "Children's support & protection": icons.DemographicChildren,
        "Sexual assault support": icons.SexualViolence,
        "Financial help": icons.Money,
        "Help for people using violence": icons.UsingViolence,
        "Help for pets": icons.DemographicPets,
    },
    descriptionsForAnswers: {
        "Family violence support": "Crisis counselling & accommodation.",
        "Counselling": "Someone to talk to.",
        "Police": "Stations & liaison officers.",
        "Legal support": "Intervention orders, court & separation.",
        "Children's support & protection":
            "Support services & child protection.",
        "Sexual assault support": "Counselling, medical care & support.",
        "Financial help": "Money counsellors & support.",
        "Help for people using violence":
            "Counselling & behaviour change programs",
        "Help for pets": "Emergency kennel & support.",
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
