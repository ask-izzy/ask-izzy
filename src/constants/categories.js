/* @flow */

import React from "react";
import { slugify } from "underscore.string";

import icons from "../icons";
import * as iss from "../iss";

import personalisation from "../pages/personalisation";

class Category {
    key: string;
    name: string;
    byline: string;
    icon: ReactClass;
    search: iss.searchRequest;
    info: ?string|ReactElement;
    personalisation: Array<React.Component>;

    constructor(props: {
        name: string,
        byline: string,
        icon: ReactClass,
        search: iss.searchRequest,
        info?: string|ReactElement,
        personalisation: Array<React.Component>,
    }) {
        this.name = props.name;
        this.byline = props.byline;
        this.icon = props.icon;
        this.key = slugify(this.name);
        this.search = props.search;
        this.info = props.info;
        this.personalisation = props.personalisation;
    }
}

const categories:Array<Category> = [
    new Category({
        name: "Housing",
        byline: "A place to stay",
        icon: icons.House,
        search: {
            q: "housing",
            service_type: "housing",
        },
        info: "It's important to act early on housing.",
        personalisation: [
            personalisation.SleepTonight,
            personalisation.HousingSubcategories,
            personalisation.Location,
            personalisation.Gender,
            personalisation.Age,
            personalisation.Demographics,
        ],
    }),
    new Category({
        name: "Food",
        byline: "Something to eat",
        icon: icons.Food,
        search: {
            q: "free breakfast lunch dinner",
        },
        personalisation: [
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Everyday things",
        byline: "Swags, Clothes, etc",
        icon: icons.Things,
        search: {
            q: "material aid",
        },
        personalisation: [
            personalisation.EverydayThingsSubcategories,
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Legal",
        byline: "Police, law & fines",
        icon: icons.Legal,
        search: {
            q: "legal aid",
        },
        personalisation: [
            personalisation.LegalSubcategories,
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Money help",
        byline: "Emergency funds, bills etc",
        icon: icons.Money,
        search: {
            q: "financial aid",
        },
        personalisation: [
            personalisation.MoneySubcategories,
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Health",
        byline: "Physical, mental, emotional",
        icon: icons.Health,
        search: {
            q: "physical health",
        },
        personalisation: [
            personalisation.HealthSubcategories,
            personalisation.Location,
            personalisation.Gender,
            personalisation.Age,
            personalisation.Demographics,
        ],
    }),
    new Category({
        name: "Addiction",
        byline: "Drugs, alcohol & gambling",
        icon: icons.Addiction,
        search: {
            q: "substance abuse gambling",
        },
        personalisation: [
            personalisation.AddictionSubcategories,
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Support & counselling",
        byline: "Someone to help",
        icon: icons.Mental,
        search: {
            q: "mental health",
        },
        personalisation: [
            personalisation.CounsellingSubcategories,
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Life skills & education",
        byline: "Everyday skills & training",
        icon: icons.Skills,
        search: {
            q: "life skills",
        },
        personalisation: [
            personalisation.LifeSkillsSubcategories,
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Finding work",
        byline: "Earning & volunteering",
        icon: icons.Job,
        search: {
            q: "employment",
        },
        personalisation: [
            personalisation.JobSubcategories,
            personalisation.Location,
            personalisation.Gender,
            personalisation.Age,
            personalisation.Demographics,
        ],
    }),
    new Category({
        name: "Centrelink",
        byline: "Access to services",
        icon: icons.Centrelink,
        search: {
            q: '"centrelink"',
            name: "centrelink",
        },
        personalisation: [
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Something to do",
        byline: "Near you",
        icon: icons.Entertainment,
        search: {
            q: "recreation",
        },
        personalisation: [
            personalisation.Location,
            personalisation.Gender,
            personalisation.Age,
            personalisation.Demographics,
        ],
    }),
    new Category({
        name: "Facilities",
        byline: "Toilets, libraries etc",
        icon: icons.Facilaties,
        search: {
            q: "libraries toilets",
        },
        personalisation: [
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Technology",
        byline: "Wifi, charging etc",
        icon: icons.Tech,
        search: {
            q: "computers wifi charging",
        },
        personalisation: [
            personalisation.TechnologySubcategories,
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Have your say",
        byline: "Complaints and advocacy",
        icon: icons.Advocacy,
        search: {
            q: "advocacy",
        },
        personalisation: [
            personalisation.AdvocacySubcategories,
            personalisation.ComplaintSubcategories,
            personalisation.AdvocacySituation,
            personalisation.Location,
        ],
    }),

];

export default categories;
