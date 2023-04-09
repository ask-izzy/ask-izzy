import ExperiencingViolence from "@/src/icons/ExperiencingViolence.js";
import Support from "@/src/icons/Support.js";
import Police from "@/src/icons/Police.js";
import Legal from "@/src/icons/Legal.js";
import DemographicChildren from "@/src/icons/DemographicChildren.js";
import SexualViolence from "@/src/icons/SexualViolence.js";
import Money from "@/src/icons/Money.js";
import UsingViolence from "@/src/icons/UsingViolence.js";
import DemographicPets from "@/src/icons/DemographicPets.js";


export default ({
    type: "question",
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
                term: ["\"family violence\""],
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
                    "-\"hire of facilities\"",
                    "-police",
                ],
            },
        },
        "Children's support & protection": {
            $concat: {
                term: ["service_type:Child Protection/ Placement"],
            },
            $removeElms: {
                term: ["\"family violence\""],
            },
        },
        "Sexual assault support": {
            $concat: {
                term: ["\"sexual assault\""],
            },
            $removeElms: {
                term: ["\"family violence\""],
            },
        },
        "Financial help": {
            $concat: {
                term: [
                    "\"financial counselling\"",
                    "-grants",
                    "name:\"financial counselling\"",
                ],
            },
            $removeElms: {
                term: ["\"family violence\""],
            },
        },
        "Help for people using violence": {
            $concat: {
                term: ["\"using violence\""],
            },
            $removeElms: {
                term: ["\"family violence\""],
            },
            $applyIfShouldInjectAccessPoints: {
                $concat: {
                    term: ["\"men's behaviour change\""],
                },
                $removeElms: {
                    term: ["\"using violence\""],
                },
            },
        },
        "Help for pets": {
            $concat: {
                term: [
                    "pets",
                    "-\"animal control\"",
                    "-\"effectiveness training\"",
                ],
            },
        },
    },
    icons: {
        "Family violence support": ExperiencingViolence,
        "Counselling": Support,
        "Police": Police,
        "Legal support": Legal,
        "Children's support & protection": DemographicChildren,
        "Sexual assault support": SexualViolence,
        "Financial help": Money,
        "Help for people using violence": UsingViolence,
        "Help for pets": DemographicPets,
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
    title: "Services",
    prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Help for people using violence":
            return "Behavioural support";
        case "Help for pets":
            return "Help with pets";
        default:
            return answer
        }
    },
} as any)
