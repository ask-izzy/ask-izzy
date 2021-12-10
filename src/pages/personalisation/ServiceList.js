/* @flow */
import type { ElementConfig as ReactElementConfig } from "react"

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/ServiceSearchRequest";
import ExperiencingViolence from "../../icons/experiencing-violence.svg";
import Support from "../../icons/support.svg";
import Police from "../../icons/police.svg";
import Legal from "../../icons/legal.svg";
import DemographicChildren from "../../icons/demographic-children.svg";
import SexualViolence from "../../icons/sexual-violence.svg";
import Money from "../../icons/money.svg";
import UsingViolence from "../../icons/using-violence.svg";
import DemographicPets from "../../icons/demographic-pets.svg";
import Location from "./Location";

export default class ServiceList extends BaseQuestion {
    static title: string = "Services";

    static defaultProps: ReactElementConfig<typeof BaseQuestion> = {
        name: "service-list",
        question: "What best describes what you need?",
        info: "All of your answers are private and anonymous.",
        possibleAnswers: {
            "Family violence support": append(""),
            "Counselling": append("counselling"),
            "Police": remove("(family violence)")
                .append("police dvlo"),
            "Legal support": append("legal -permits -ceremonies")
                .append("-making -checks -electoral -taxation")
                .append("-centrelink -immigration -(hire of facilities)")
                .append("-police"),
            "Children's support & protection": remove("(family violence)")
                .append("service_type:Child Protection/ Placement"),
            "Sexual assault support": remove("(family violence)")
                .append("(sexual assault)"),
            "Financial help": remove("(family violence)")
                .append("(financial counselling)")
                .append("-grants")
                .append("name:\"financial counselling\""),
            "Help for people using violence": remove("(family violence)")
                .append("(using violence)")
                .conditionally(
                    remove("(using violence)")
                        .append("(men's behaviour change)"),
                    // Check for injection of access points currently checks
                    // if a user is in Victoria
                    () => Location.shouldInjectAccessPoints()
                ),
            "Help for pets": append("pets -(animal control)")
                .append("-(effectiveness training)"),
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
    };

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
