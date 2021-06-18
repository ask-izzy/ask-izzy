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
            q: "housing -(coordinating bodies) -(respite care) " +
                "-(housing information) -hef " +
                "-(holiday accommodation)",
            service_type: ["housing"],
            minimum_should_match: "30%",
        },
        sortingOptions: [],
        personalisation: [
            personalisation.Location,
            personalisation.SleepTonight,
            personalisation.Gender,
            personalisation.Age,
            personalisation.Demographics,
            ...personalisation.OnlineSafetyScreenBundle(
                personalisation.HousingAreYouSafe
            ),
        ],
    }): Category),
    (new Category({
        name: "Food",
        byline: "Something to eat.",
        icon: icons.Food,
        search: {
            q: "meals -(coordinating bodies)" +
                " -(home care) -(food safety)" +
                " -(meals on wheels) -(assistance with meals)" +
                " -(hire of facilities) -chsp -(meal preparation)",
        },
        sortingOptions: [],
        personalisation: [
            personalisation.Location,
            personalisation.FoodSubcategories,
        ],
    }): Category),
    (new Category({
        name: "Everyday things",
        byline: "Swags, clothes, food vouchers etc.",
        icon: icons.Things,
        search: {
            q: "material aid -(coordinating bodies)",
            service_type: ["material aid"],
        },
        sortingOptions: [],
        personalisation: [
            personalisation.Location,
            personalisation.EverydayThingsSubcategories,
        ],
    }): Category),
    (new Category({
        name: "Domestic & family violence help",
        byline: "Scared of partner or family member.",
        icon: icons.EscapeViolence,
        search: {
            q: "(family violence) -(coordinating bodies) -(fire-fighting)",
        },
        sortingOptions: [],
        personalisation: [
            ...personalisation.OnlineSafetyScreenBundle(
                personalisation.AreYouSafe
            ),
            personalisation.Location,
            personalisation.DfvDemographics,
            personalisation.Under18DomesticViolenceScreen,
            personalisation.UsingViolenceScreen,
            personalisation.LgbtiqaDomesticViolenceScreen,
            personalisation.ServiceList,
        ],
    }): Category),
    (new Category({
        name: "Health",
        byline: "Physical, mental, emotional.",
        icon: icons.Health,
        search: {
            q: "(community health) -(coordinating bodies)",
            minimum_should_match: "30%",
            show_in_askizzy_health: true,
        },
        sortingOptions: [
            {
                key: "free_or_low_cost",
                value: true,
                name: "Free or low/cost",
                time: null,
            },
            {
                key: "is_bulk_billing",
                value: true,
                name: "Bulk billing",
                time: null,
            },
            {
                key: "healthcare_card_holders",
                value: true,
                name: "Health Care card holders",
                time: null,
            },
        ],
        personalisation: [
            personalisation.Location,
            personalisation.HealthSubcategories,
            ...personalisation.OnlineSafetyScreenBundle(
                personalisation.HealthAreYouSafe
            ),
            personalisation.DemographicsIndigenous,
        ],
    }): Category),
    (new Category({
        name: "Centrelink",
        byline: "Access to services.",
        icon: icons.Centrelink,
        search: {
            q: "\"centrelink\"",
            name: "\"centrelink\"",
        },
        sortingOptions: [],
        personalisation: [
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Money help",
        byline: "Emergency funds, bills etc.",
        icon: icons.Money,
        search: {
            q: "financial aid -(coordinating bodies) -grants -heritage",
        },
        sortingOptions: [],
        personalisation: [
            personalisation.Location,
            personalisation.MoneySubcategories,
        ],
    }): Category),
    (new Category({
        name: "Support & counselling",
        byline: "Relationships, gambling & LGBTIQA+.",
        icon: icons.Support,
        search: {
            q: "counselling",
            minimum_should_match: "1",
        },
        sortingOptions: [],
        personalisation: [
            personalisation.Location,
            personalisation.CounsellingSubcategories,
            ...personalisation.OnlineSafetyScreenBundle(
                personalisation.CounsellingAreYouSafe
            ),
            personalisation.DemographicsIndigenous,
        ],
    }): Category),
    (new Category({
        name: "Legal",
        byline: "Police, law & fines.",
        icon: icons.Legal,
        search: {
            q: "legal (legal aid) -(coordinating bodies) -permits " +
                "-ceremonies -making -checks -electoral -taxation " +
                "-centrelink -immigration -(hire of facilities)",
        },
        sortingOptions: [],
        personalisation: [
            personalisation.Location,
            personalisation.LegalSubcategories,
            ...personalisation.OnlineSafetyScreenBundle(
                personalisation.LegalAreYouSafe
            ),
            personalisation.DemographicsIndigenous,
        ],
    }): Category),
    (new Category({
        name: "Drugs & alcohol",
        byline: "Support & assistance.",
        icon: icons.Addiction,
        search: {
            q: "substance abuse -(coordinating bodies)" +
                " -(registered training)",
            minimum_should_match: "30%",
        },
        sortingOptions: [],
        personalisation: [
            personalisation.Location,
            personalisation.AddictionSubcategories,
            personalisation.DemographicsIndigenous,
        ],
    }): Category),
    (new Category({
        name: "Life skills & education",
        byline: "Everyday skills & training.",
        icon: icons.Skills,
        search: {
            q: "life skills education -(coordinating bodies)" +
                " -chsp -hacc",
        },
        sortingOptions: [],
        personalisation: [
            personalisation.Location,
            personalisation.LifeSkillsSubcategories,
            personalisation.DemographicsIndigenous,
        ],
    }): Category),
    (new Category({
        name: "Finding work",
        byline: "Earning & volunteering.",
        icon: icons.Job,
        search: {
            q: "employment -(coordinating bodies)",
            service_type: ["employment"],
        },
        sortingOptions: [],
        personalisation: [
            personalisation.Location,
            personalisation.JobSubcategories,
        ],
    }): Category),
    (new Category({
        name: "Facilities",
        byline: "Toilets.",
        icon: icons.Facilities,
        search: {
            q: "public facilities" +
                " -(coordinating bodies) -(hire of facilities)" +
                " -maintenance",
        },
        sortingOptions: [],
        personalisation: [
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Something to do",
        byline: "Libraries, Community Hubs etc.",
        icon: icons.Entertainment,
        search: {
            q: "recreation libraries pools -(coordinating bodies) " +
                "-physiology -permit -hire -grants " +
                "-(sports medicine) -(sports physician) " +
                "-(sports psychology)",
        },
        sortingOptions: [],
        personalisation: [
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Technology",
        byline: "Wifi, charging etc.",
        icon: icons.Tech,
        search: {
            q: "wifi internet computer",
        },
        sortingOptions: [],
        personalisation: [
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Advocacy",
        byline: "Complaints and advice.",
        icon: icons.Advocacy,
        search: {
            q: "consumer issues mediation discrimination " +
                "disputes advocacy -research -(coordinating bodies)",
        },
        sortingOptions: [],
        personalisation: [
            personalisation.Location,
            personalisation.AdvocacySubcategories,
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
