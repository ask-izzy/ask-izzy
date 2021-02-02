/* @flow */
import House from "../icons/house.svg";
import Food from "../icons/food.svg";
import Things from "../icons/things.svg";
import EscapeViolence from "../icons/escape-violence.svg";
import Health from "../icons/health.svg";
import Centrelink from "../icons/centrelink.svg";
import Money from "../icons/money.svg";
import Support from "../icons/support.svg";
import Legal from "../icons/legal.svg";
import Addiction from "../icons/addiction.svg";
import Skills from "../icons/skills.svg";
import Job from "../icons/job.svg";
import Facilities from "../icons/facilities.svg";
import Entertainment from "../icons/entertainment.svg";
import Tech from "../icons/tech.svg";
import Advocacy from "../icons/advocacy.svg";

import Category from "./Category"

import personalisation from "../pages/personalisation";

const categories = [
    new Category({
        name: "Housing",
        byline: "A place to stay",
        icon: House,
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
            ...personalisation.OnlineSafetyScreenBundle(
                personalisation.HousingAreYouSafe
            ),
        ],
    }),
    new Category({
        name: "Food",
        byline: "Something to eat",
        icon: Food,
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
        byline: "Swags, clothes, food vouchers etc.",
        icon: Things,
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
        icon: EscapeViolence,
        search: {
            q: "(family violence) -(coordinating bodies) -(fire-fighting)",
        },
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
    }),
    new Category({
        name: "Health",
        byline: "Physical, mental, emotional",
        icon: Health,
        search: {
            q: "(community health) -(coordinating bodies)",
            minimum_should_match: "30%",
            show_in_askizzy_health: true,
        },
        personalisation: [
            personalisation.Location,
            personalisation.HealthSubcategories,
            ...personalisation.OnlineSafetyScreenBundle(
                personalisation.HealthAreYouSafe
            ),
            personalisation.DemographicsIndigenous,
        ],
    }),
    new Category({
        name: "Centrelink",
        byline: "Access to services",
        icon: Centrelink,
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
        byline: "Emergency funds, bills etc.",
        icon: Money,
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
        icon: Support,
        search: {
            q: "counselling",
            minimum_should_match: "1",
        },
        personalisation: [
            personalisation.Location,
            personalisation.CounsellingSubcategories,
            ...personalisation.OnlineSafetyScreenBundle(
                personalisation.CounsellingAreYouSafe
            ),
            personalisation.DemographicsIndigenous,
        ],
    }),
    new Category({
        name: "Legal",
        byline: "Police, law & fines",
        icon: Legal,
        search: {
            q: "legal (legal aid) -(coordinating bodies) -permits " +
                "-ceremonies -making -checks -electoral -taxation " +
                "-centrelink -immigration -(hire of facilities)",
        },
        personalisation: [
            personalisation.Location,
            personalisation.LegalSubcategories,
            ...personalisation.OnlineSafetyScreenBundle(
                personalisation.LegalAreYouSafe
            ),
            personalisation.DemographicsIndigenous,
        ],
    }),
    new Category({
        name: "Drugs & alcohol",
        byline: "Support & assistance",
        icon: Addiction,
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
        icon: Skills,
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
        icon: Job,
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
        icon: Facilities,
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
        byline: "Libraries, Community Hubs etc.",
        icon: Entertainment,
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
        byline: "Wifi, charging etc.",
        icon: Tech,
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
        icon: Advocacy,
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

// flow:disable flowjs needs to be updated to include fromEntries
const categoryMap = Object.fromEntries(
    categories.map(category => [category.key, category])
)

export function getCategory(key: string): ?Category {
    return categoryMap[key]
}
