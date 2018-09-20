/* @flow */

import React from "react";
import BaseQuestion from "./BaseQuestion";
import { append } from "../../iss/Search";
import icons from "../../icons";

export default class ServiceList extends BaseQuestion {
    static title = "Service";

    static propTypes = BaseQuestion.propTypes;

    static showInSummary(): boolean {
        return false;
    }

    static showPage(): boolean {
        return !this.answer;
    }

    static defaultProps = {
        name: "service-list",
        question: "What best describes what you need?",
        byline: "All of your ansers are private and anonymous",
        answers: {
            "Domestic Violence": append(""),
            "Counselling": append(""),
            "Police": append(""),
            "Legal support": append(""),
            "Children's support and protection": append(""),
            "Sexual assault": append(""),
            "Financial Help": append(""),
            "Help for people using violence": append(""),
            "Help for Pets": append(""),
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
            "Domestic Violence": "Crisis counselling, accomodation",
            "Counselling": "Someone to talk to",
            "Police": "Stations and liason officers",
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
