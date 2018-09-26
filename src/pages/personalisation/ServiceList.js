/* @flow */

import BaseQuestion from "./BaseQuestion";
import { append, remove } from "../../iss/Search";
import icons from "../../icons";

export default class ServiceList extends BaseQuestion {
    static title = "Service";

    static defaultProps = {
        name: "service-list",
        question: "What best describes what you need?",
        byline: "All of your answers are private and anonymous",
        answers: {
            "Domestic Violence": append(""),
            "Counselling": append("counselling"),
            "Police": remove("(family violence)")
                .append("police dvlo"),
            "Legal support": append("legal -permits -ceremonies")
                .append("-making -checks -electoral -taxation")
                .append("-centrelink -immigration -(hire of facilities)")
                .append("-police"),
            "Children's support and protection": remove("(family violence)")
                .append("service_type:Child Protection/ Placement"),
            "Sexual assault": remove("(family violence)")
                .append("(sexual assault)"),
            "Financial Help": remove("(family violence)")
                .append("(financial counselling)")
                .append("-grants")
                .append("name:\"financial counselling\""),
            "Help for people using violence": remove("(family violence)")
                .append("(anger management)"),
            "Help for Pets": append("pets -(animal control)")
                .append("-(effectiveness training)"),
        },
        icons: {
            "Domestic Violence": icons.ExperiencingViolence,
            "Counselling": icons.Support,
            "Police": icons.Police,
            "Legal support": icons.Legal,
            "Children's support and protection": icons.DemographicChildren,
            "Sexual assault": icons.SexualViolence,
            "Financial Help": icons.Money,
            "Help for people using violence": icons.UsingViolence,
            "Help for Pets": icons.DemographicPets,
        },
        answersDesc: {
            "Domestic Violence": "Crisis counselling, accommodation",
            "Counselling": "Someone to talk to",
            "Police": "Stations and liaison officers",
            "Legal support": "Intervention orders, court and separation",
            "Children's support and protection":
                "Support services, child protection",
            "Sexual assault": "Counselling, medical care and support",
            "Financial Help": "Money counsellors and support",
            "Help for people using violence":
                "Counselling, behaviour change programs",
            "Help for Pets": "Emergency kennel and support",
        },
    };
}
