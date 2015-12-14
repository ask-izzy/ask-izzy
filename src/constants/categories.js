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
            q: "housing -(coordinating bodies)",
            service_type: "housing",
        },
        personalisation: [
            personalisation.Location,
            personalisation.SleepTonight,
            personalisation.HousingSubcategories,
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
            q: "free food meals -health -(coordinating bodies)" +
                " -(hacc) -(food safety)",
        },
        personalisation: [
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Everyday things",
        byline: "Swags, Clothes, Food Vouchers, etc",
        icon: icons.Things,
        search: {
            q: "material aid -(coordinating bodies)",
            service_type: "material aid",
        },
        personalisation: [
            personalisation.Location,
            personalisation.EverydayThingsSubcategories,
        ],
    }),
    new Category({
        name: "Health",
        byline: "Physical, mental, emotional",
        icon: icons.Health,
        search: {
            q: "health -(coordinating bodies)",
        },
        personalisation: [
            personalisation.Location,
            personalisation.HealthSubcategories,
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
            name: '"centrelink"',
        },
        personalisation: [
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Money help",
        byline: "Emergency funds, bills etc",
        icon: icons.Money,
        search: {
            q: "financial aid -(coordinating bodies)",
        },
        personalisation: [
            personalisation.Location,
            personalisation.MoneySubcategories,
        ],
    }),
    new Category({
        name: "Support & counselling",
        byline: "Someone to help",
        icon: icons.Support,
        search: {
            q: "mental health -(coordinating bodies)",
        },
        personalisation: [
            personalisation.Location,
            personalisation.CounsellingSubcategories,
        ],
    }),
    new Category({
        name: "Legal",
        byline: "Police, law & fines",
        icon: icons.Legal,
        search: {
            q: "legal aid -(coordinating bodies)",
        },
        personalisation: [
            personalisation.Location,
            personalisation.LegalSubcategories,
        ],
    }),
    new Category({
        name: "Addiction",
        byline: "Drugs, alcohol & gambling",
        icon: icons.Addiction,
        search: {
            q: "addiction -(coordinating bodies)",
        },
        personalisation: [
            personalisation.Location,
            personalisation.AddictionSubcategories,
        ],
    }),
    new Category({
        name: "Life skills & education",
        byline: "Everyday skills & training",
        icon: icons.Skills,
        search: {
            q: "life skills education -(coordinating bodies)",
        },
        personalisation: [
            personalisation.Location,
            personalisation.LifeSkillsSubcategories,
        ],
    }),
    new Category({
        name: "Finding work",
        byline: "Earning & volunteering",
        icon: icons.Job,
        search: {
            q: "employment -(coordinating bodies)",
        },
        personalisation: [
            personalisation.Location,
            personalisation.JobSubcategories,
        ],
    }),
    new Category({
        name: "Facilities",
        byline: "Toilets, libraries etc",
        icon: icons.Facilaties,
        search: {
            q: "toilets public libraries -(coordinating bodies)",
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
            q: "recreation -(coordinating bodies)",
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
            q: "wifi computer class",
        },
        personalisation: [
            personalisation.Location,
            personalisation.TechnologySubcategories,
        ],
    }),
    new Category({
        name: "Have your say",
        byline: "Complaints and advocacy",
        icon: icons.Advocacy,
        search: {
            q: "advocacy -(coordinating bodies)",
        },
        personalisation: [
            personalisation.Location,
            personalisation.AdvocacySubcategories,
            personalisation.ComplaintSubcategories,
        ],
    }),

];

export default categories;
