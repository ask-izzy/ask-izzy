/* @flow */

import { slugify } from "underscore.string";

import icons from "../icons";
import * as iss from "../iss";

import personalisation from "../pages/personalisation";

export class Category {
    key: string;
    name: string;
    byline: string;
    icon: React$ComponentType<any>;
    search: iss.searchRequest;
    info: ?string|React$Element<any>;
    // I can't get flow to happily check that these are react classes.
    personalisation: Array<any>;

    constructor(props: {
        name: string,
        byline: string,
        icon: React$ComponentType<any>,
        search: iss.searchRequest,
        info?: string|React$Element<any>,
        personalisation: Array<any>,
    }) {
        this.name = props.name;
        this.byline = props.byline;
        this.icon = props.icon;
        this.key = slugify(this.name);
        this.search = {
            catchment: "prefer",
            ...props.search,
        };
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
            q: "housing -(coordinating bodies) -(respite care) " +
                "-(housing information) -hef " +
                "-(holiday accommodation)",
            service_type: ["housing"],
            minimum_should_match: "30%",
        },
        personalisation: [
            personalisation.Location,
            personalisation.SleepTonight,
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
            q: "meals -(coordinating bodies)" +
                " -(home care) -(food safety)" +
                " -(meals on wheels) -(assistance with meals)" +
                " -(hire of facilities) -chsp -(meal preparation)",
        },
        personalisation: [
            personalisation.Location,
            personalisation.FoodSubcategories,
        ],
    }),
    new Category({
        name: "Everyday things",
        byline: "Swags, clothes, food vouchers etc",
        icon: icons.Things,
        search: {
            q: "material aid -(coordinating bodies)",
            service_type: ["material aid"],
        },
        personalisation: [
            personalisation.Location,
            personalisation.EverydayThingsSubcategories,
        ],
    }),
    new Category({
        name: "Domestic & family violence help",
        byline: "Scared of partner or family member",
        icon: icons.EscapeViolence,
        personalisation: [
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Health",
        byline: "Physical, mental, emotional",
        icon: icons.Health,
        search: {
            q: "(community health) -(coordinating bodies)",
            minimum_should_match: "30%",
            healthcare_card_holders: true,
        },
        personalisation: [
            personalisation.Location,
            personalisation.HealthSubcategories,
            personalisation.DemographicsIndigenous,
        ],
    }),
    new Category({
        name: "Centrelink",
        byline: "Access to services",
        icon: icons.Centrelink,
        search: {
            q: "\"centrelink\"",
            name: "\"centrelink\"",
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
            q: "financial aid -(coordinating bodies) -grants -heritage",
        },
        personalisation: [
            personalisation.Location,
            personalisation.MoneySubcategories,
        ],
    }),
    new Category({
        name: "Support & counselling",
        byline: "Relationships, gambling & LGBTIQA+",
        icon: icons.Support,
        search: {
            q: "counselling",
            minimum_should_match: "1",
        },
        personalisation: [
            personalisation.Location,
            personalisation.CounsellingSubcategories,
            personalisation.DemographicsIndigenous,
        ],
    }),
    new Category({
        name: "Legal",
        byline: "Police, law & fines",
        icon: icons.Legal,
        search: {
            q: "legal (legal aid) -(coordinating bodies) -permits " +
                "-ceremonies -making -checks -electoral -taxation " +
                "-centrelink -immigration -(hire of facilities)",
        },
        personalisation: [
            personalisation.Location,
            personalisation.LegalSubcategories,
            personalisation.DemographicsIndigenous,
        ],
    }),
    new Category({
        name: "Drugs & alcohol",
        byline: "Support & assistance",
        icon: icons.Addiction,
        search: {
            q: "substance abuse -(coordinating bodies)" +
                " -(registered training)",
            minimum_should_match: "30%",
        },
        personalisation: [
            personalisation.Location,
            personalisation.AddictionSubcategories,
            personalisation.DemographicsIndigenous,
        ],
    }),
    new Category({
        name: "Life skills & education",
        byline: "Everyday skills & training",
        icon: icons.Skills,
        search: {
            q: "life skills education -(coordinating bodies)" +
                " -chsp -hacc",
        },
        personalisation: [
            personalisation.Location,
            personalisation.LifeSkillsSubcategories,
            personalisation.DemographicsIndigenous,
        ],
    }),
    new Category({
        name: "Finding work",
        byline: "Earning & volunteering",
        icon: icons.Job,
        search: {
            q: "employment -(coordinating bodies)",
            service_type: ["employment"],
        },
        personalisation: [
            personalisation.Location,
            personalisation.JobSubcategories,
        ],
    }),
    new Category({
        name: "Facilities",
        byline: "Toilets",
        icon: icons.Facilities,
        search: {
            q: "public facilities" +
                " -(coordinating bodies) -(hire of facilities)" +
                " -maintenance",
        },
        personalisation: [
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Something to do",
        byline: "Libraries, Community Hubs etc",
        icon: icons.Entertainment,
        search: {
            q: "recreation libraries pools -(coordinating bodies) " +
                "-physiology -permit -hire -grants " +
                "-(sports medicine) -(sports physician) " +
                "-(sports psychology)",
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
            q: "wifi internet computer",
        },
        personalisation: [
            personalisation.Location,
        ],
    }),
    new Category({
        name: "Advocacy",
        byline: "Complaints and advice",
        icon: icons.Advocacy,
        search: {
            q: "consumer issues mediation discrimination " +
                "disputes advocacy -research -(coordinating bodies)",
        },
        personalisation: [
            personalisation.Location,
            personalisation.AdvocacySubcategories,
        ],
    }),

];

export default categories;
