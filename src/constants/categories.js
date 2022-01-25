/* @flow */
import icons from "../icons";

import Category from "./Category"

import personalisation from "../pages/personalisation";

const categories = [
    (new Category({
        name: "Housing",
        byline: "A place to stay.",
        icon: icons.House,
        search: {
            query: "housing -(coordinating bodies) -(respite care) " +
                "-(housing information) -hef " +
                "-(holiday accommodation)",
            service_type: ["housing"],
            minimum_should_match: "30%",
        },
        personalisation: [
            personalisation.SleepTonight,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
            personalisation.Gender,
            personalisation.Age,
            personalisation.Demographics,
            personalisation.HousingAreYouSafe,
            personalisation.OnlineSafetyScreen,
        ],
    }): Category),
    (new Category({
        name: "Food",
        byline: "Something to eat.",
        icon: icons.Food,
        search: {
            query: "meals -(coordinating bodies)" +
                " -(home care) -(food safety)" +
                " -(meals on wheels) -(assistance with meals)" +
                " -(hire of facilities) -chsp -(meal preparation)",
        },
        personalisation: [
            personalisation.FoodSubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Everyday things",
        byline: "Swags, clothes, food vouchers etc.",
        icon: icons.Things,
        search: {
            query: "material aid -(coordinating bodies)",
            service_type: ["material aid"],
        },
        personalisation: [
            personalisation.EverydayThingsSubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Domestic & family violence help",
        byline: "Scared of partner or family member.",
        icon: icons.EscapeViolence,
        search: {
            query: "(family violence) -(coordinating bodies) -(fire-fighting)",
        },
        personalisation: [
            personalisation.AreYouSafe,
            personalisation.OnlineSafetyScreen,
            personalisation.DVFSubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
            personalisation.DfvDemographics,
            personalisation.Under18DomesticViolenceScreen,
            personalisation.UsingViolenceScreen,
            personalisation.LgbtiqaDomesticViolenceScreen,
        ],
    }): Category),
    (new Category({
        name: "Health",
        byline: "Physical, mental, emotional.",
        icon: icons.Health,
        search: {
            query: "(community health) -(coordinating bodies)",
            minimum_should_match: "30%",
            show_in_askizzy_health: true,
        },
        personalisation: [
            personalisation.HealthSubcategories,
            personalisation.HealthAreYouSafe,
            personalisation.OnlineSafetyScreen,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
            personalisation.DemographicsIndigenous,
        ],
    }): Category),
    (new Category({
        name: "Centrelink",
        byline: "Access to services.",
        icon: icons.Centrelink,
        search: {
            query: "\"centrelink\"",
            name: "\"centrelink\"",
        },
        personalisation: [
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Money help",
        byline: "Emergency funds, bills etc.",
        icon: icons.Money,
        search: {
            query: "financial aid -(coordinating bodies) -grants -heritage",
        },
        personalisation: [
            personalisation.MoneySubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Support & counselling",
        byline: "Relationships, gambling & LGBTIQA+.",
        icon: icons.Support,
        search: {
            query: "counselling",
            minimum_should_match: "1",
        },
        personalisation: [
            personalisation.CounsellingSubcategories,
            personalisation.CounsellingAreYouSafe,
            personalisation.OnlineSafetyScreen,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
            personalisation.DemographicsIndigenous,
        ],
    }): Category),
    (new Category({
        name: "Legal",
        byline: "Police, law & fines.",
        icon: icons.Legal,
        search: {
            query: "legal (legal aid) -(coordinating bodies) -permits " +
                "-ceremonies -making -checks -electoral -taxation " +
                "-centrelink -immigration -(hire of facilities)",
        },
        personalisation: [
            personalisation.LegalSubcategories,
            personalisation.LegalAreYouSafe,
            personalisation.OnlineSafetyScreen,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
            personalisation.DemographicsIndigenous,
        ],
    }): Category),
    (new Category({
        name: "Drugs & alcohol",
        byline: "Support & assistance.",
        icon: icons.Addiction,
        search: {
            query: "substance abuse -(coordinating bodies)" +
                " -(registered training)",
            minimum_should_match: "30%",
        },
        personalisation: [
            personalisation.AddictionSubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
            personalisation.DemographicsIndigenous,
        ],
    }): Category),
    (new Category({
        name: "Life skills & education",
        byline: "Everyday skills & training.",
        icon: icons.Skills,
        search: {
            query: "life skills education -(coordinating bodies)" +
                " -chsp -hacc",
        },
        personalisation: [
            personalisation.LifeSkillsSubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
            personalisation.DemographicsIndigenous,
        ],
    }): Category),
    (new Category({
        name: "Finding work",
        byline: "Earning & volunteering.",
        icon: icons.Job,
        search: {
            query: "employment -(coordinating bodies)",
            service_type: ["employment"],
        },
        personalisation: [
            personalisation.JobSubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Facilities",
        byline: "Toilets.",
        icon: icons.Facilities,
        search: {
            query: "public facilities" +
                " -(coordinating bodies) -(hire of facilities)" +
                " -maintenance",
        },
        personalisation: [
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Something to do",
        byline: "Libraries, Community Hubs etc.",
        icon: icons.Entertainment,
        search: {
            query: "recreation libraries pools -(coordinating bodies) " +
                "-physiology -permit -hire -grants " +
                "-(sports medicine) -(sports physician) " +
                "-(sports psychology)",
        },
        personalisation: [
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Technology",
        byline: "Wifi, charging etc.",
        icon: icons.Tech,
        search: {
            query: "wifi internet computer",
        },
        personalisation: [
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Advocacy",
        byline: "Complaints and advice.",
        icon: icons.Advocacy,
        search: {
            query: "consumer issues mediation discrimination " +
                "disputes advocacy -research -(coordinating bodies)",
        },
        personalisation: [
            personalisation.AdvocacySubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ],
    }): Category),

];

export default categories;

// $FlowIgnore flowjs needs to be updated to include fromEntries
const categoryMap = Object.fromEntries(
    categories.map(category => [category.key, category])
)

export function getCategory(key: string): ?Category {
    return categoryMap[key]
}
