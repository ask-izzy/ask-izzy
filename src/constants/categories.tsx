import React from "react";
import type { NextRouter } from "next/router";

import Category from "@/src/constants/Category";

import House from "@/src/icons/House"
import Food from "@/src/icons/Food"
import Things from "@/src/icons/Things"
import EscapeViolence from "@/src/icons/EscapeViolence"
import Health from "@/src/icons/Health"
import Centrelink from "@/src/icons/Centrelink"
import Money from "@/src/icons/Money"
import Support from "@/src/icons/Support"
import Legal from "@/src/icons/Legal"
import Addiction from "@/src/icons/Addiction"
import Skills from "@/src/icons/Skills"
import Job from "@/src/icons/Job"
import Facilities from "@/src/icons/Facilities"
import Entertainment from "@/src/icons/Entertainment"
import Tech from "@/src/icons/Tech"
import Advocacy from "@/src/icons/Advocacy"
import Search from "@/src/icons/Search"

/* eslint-disable max-len */
import AddictionSubcategories from "@/src/constants/personalisation-pages/AddictionSubcategories";
import AdvocacySubcategories from "@/src/constants/personalisation-pages/AdvocacySubcategories";
import Age from "@/src/constants/personalisation-pages/Age";
import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe";
import CounsellingAreYouSafe from "@/src/constants/personalisation-pages/CounsellingAreYouSafe";
import CounsellingSubcategories from "@/src/constants/personalisation-pages/CounsellingSubcategories";
import DemographicsIndigenous from "@/src/constants/personalisation-pages/DemographicsIndigenous";
import Demographics from "@/src/constants/personalisation-pages/Demographics";
import DfvDemographics from "@/src/constants/personalisation-pages/DfvDemographics";
import DVFSubcategories from "@/src/constants/personalisation-pages/DVFSubcategories";
import EverydayThingsSubcategories from "@/src/constants/personalisation-pages/EverydayThingsSubcategories";
import FoodSubcategories from "@/src/constants/personalisation-pages/FoodSubcategories";
import FreeTextAreYouSafe from "@/src/constants/personalisation-pages/FreeTextAreYouSafe";
import Gender from "@/src/constants/personalisation-pages/Gender";
import HealthAreYouSafe from "@/src/constants/personalisation-pages/HealthAreYouSafe";
import HealthSubcategories from "@/src/constants/personalisation-pages/HealthSubcategories";
import HousingAreYouSafe from "@/src/constants/personalisation-pages/HousingAreYouSafe";
import JobSubcategories from "@/src/constants/personalisation-pages/JobSubcategories";
import LegalAreYouSafe from "@/src/constants/personalisation-pages/LegalAreYouSafe";
import LegalSubcategories from "@/src/constants/personalisation-pages/LegalSubcategories";
import LgbtiqaDomesticViolenceScreen from "@/src/constants/personalisation-pages/LgbtiqaDomesticViolenceScreen";
import LifeSkillsSubcategories from "@/src/constants/personalisation-pages/LifeSkillsSubcategories";
import Location from "@/src/constants/personalisation-pages/Location";
import MoneySubcategories from "@/src/constants/personalisation-pages/MoneySubcategories";
import OnlineSafetyScreen from "@/src/constants/personalisation-pages/OnlineSafetyScreen";
import SleepTonight from "@/src/constants/personalisation-pages/SleepTonight";
import Under18DomesticViolenceScreen from "@/src/constants/personalisation-pages/Under18DomesticViolenceScreen";
import UsingViolenceScreen from "@/src/constants/personalisation-pages/UsingViolenceScreen";
import WhoIsLookingForHelpDFV from "@/src/constants/personalisation-pages/WhoIsLookingForHelpDFV";
import WhoIsLookingForHelpAdvocacy from "@/src/constants/personalisation-pages/WhoIsLookingForHelpAdvocacy";
import WhoIsLookingForHelpDrugsAndAlcohol from "@/src/constants/personalisation-pages/WhoIsLookingForHelpDrugsAndAlcohol";
import WhoIsLookingForHelpEverydayThings from "@/src/constants/personalisation-pages/WhoIsLookingForHelpEverydayThings";
import WhoIsLookingForHelpFindingWork from "@/src/constants/personalisation-pages/WhoIsLookingForHelpFindingWork";
import WhoIsLookingForHelpFood from "@/src/constants/personalisation-pages/WhoIsLookingForHelpFood";
import WhoIsLookingForHelpHealth from "@/src/constants/personalisation-pages/WhoIsLookingForHelpHealth";
import WhoIsLookingForHelpHousing from "@/src/constants/personalisation-pages/WhoIsLookingForHelpHousing";
import WhoIsLookingForHelpFacilities from "@/src/constants/personalisation-pages/WhoIsLookingForHelpFacilities";
import WhoIsLookingForHelpCentrelink from "@/src/constants/personalisation-pages/WhoIsLookingForHelpCentrelink";
import WhoIsLookingForHelpLegal from "@/src/constants/personalisation-pages/WhoIsLookingForHelpLegal";
import WhoIsLookingForHelpLifeSkills from "@/src/constants/personalisation-pages/WhoIsLookingForHelpLifeSkills";
import WhoIsLookingForHelpMoney from "@/src/constants/personalisation-pages/WhoIsLookingForHelpMoney";
import WhoIsLookingForHelpSearch from "@/src/constants/personalisation-pages/WhoIsLookingForHelpSearch";
import WhoIsLookingForHelpSomethingToDo from "@/src/constants/personalisation-pages/WhoIsLookingForHelpSomethingToDo";
import WhoIsLookingForHelpSupportAndCounselling from "@/src/constants/personalisation-pages/WhoIsLookingForHelpSupportAndCounselling";
import WhoIsLookingForHelpTechnology from "@/src/constants/personalisation-pages/WhoIsLookingForHelpTechnology";
/* eslint-enable max-len */

const categories: Array<Category> = [
    (new Category({
        name: "Housing",
        byline: "A place to stay.",
        icon: House,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "housing",
                    "-\"coordinating bodies\"",
                    "-\"respite care\"",
                    "-\"housing information\"",
                    "-hef",
                    "-\"holiday accommodation\"",
                ],
                serviceTypes: ["Housing"],
            },
            minimumShouldMatch: "30%",
        },
        personalisation: [
            SleepTonight,
            WhoIsLookingForHelpHousing,
            Location,
            Gender,
            Age,
            Demographics,
            HousingAreYouSafe,
            OnlineSafetyScreen,
        ],
    })),
    (new Category({
        name: "Food",
        byline: "Something to eat.",
        icon: Food,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "meals",
                    "-\"coordinating bodies\"",
                    "-\"home care\"",
                    "-\"food safety\"",
                    "-\"meals on wheels\"",
                    "-\"assistance with meals\"",
                    "-\"hire of facilities\"",
                    "-chsp",
                    "-\"meal preparation\"",
                ],
            },
        },
        personalisation: [
            FoodSubcategories,
            WhoIsLookingForHelpFood,
            Location,
        ],
    })),
    (new Category({
        name: "Everyday things",
        byline: "Swags, clothes, food vouchers etc.",
        icon: Things,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "material",
                    "aid",
                    "-\"coordinating bodies\"",
                ],
                serviceTypes: ["Material Aid"],
            },
        },
        personalisation: [
            EverydayThingsSubcategories,
            WhoIsLookingForHelpEverydayThings,
            Location,
        ],
    })),
    (new Category({
        name: "Domestic & family violence help",
        byline: "Scared of partner or family member.",
        icon: EscapeViolence,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "\"family violence\"",
                    "-\"coordinating bodies\"",
                    "-\"fire-fighting\"",
                ],
            },
        },
        personalisation: [
            AreYouSafe,
            OnlineSafetyScreen,
            DVFSubcategories,
            WhoIsLookingForHelpDFV,
            Location,
            DfvDemographics,
            Under18DomesticViolenceScreen,
            UsingViolenceScreen,
            LgbtiqaDomesticViolenceScreen,
        ],
    })),
    (new Category({
        name: "Health",
        byline: "Physical, mental, emotional.",
        icon: Health,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "\"community health\"",
                    "-\"coordinating bodies\"",
                ],
            },
            minimumShouldMatch: "30%",
            showInAskIzzyHealth: true,
        },
        personalisation: [
            HealthSubcategories,
            HealthAreYouSafe,
            OnlineSafetyScreen,
            WhoIsLookingForHelpHealth,
            Location,
            DemographicsIndigenous,
        ],
    })),
    (new Category({
        name: "Centrelink",
        byline: "Access to services.",
        icon: Centrelink,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: ["\"centrelink\""],
            },
            name: "\"centrelink\"",
        },
        personalisation: [
            WhoIsLookingForHelpCentrelink,
            Location,
        ],
    })),
    (new Category({
        name: "Money help",
        byline: "Emergency funds, bills etc.",
        icon: Money,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "financial",
                    "aid",
                    "-\"coordinating bodies\"",
                    "-grants",
                    "-heritage",
                ],
            },
        },
        personalisation: [
            MoneySubcategories,
            WhoIsLookingForHelpMoney,
            Location,
        ],
    })),
    (new Category({
        name: "Support & counselling",
        byline: "Relationships, gambling & LGBTIQA+.",
        icon: Support,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: ["counselling"],
            },
            minimumShouldMatch: "1",
        },
        personalisation: [
            CounsellingSubcategories,
            CounsellingAreYouSafe,
            OnlineSafetyScreen,
            WhoIsLookingForHelpSupportAndCounselling,
            Location,
            DemographicsIndigenous,
        ],
    })),
    (new Category({
        name: "Legal",
        byline: "Police, law & fines.",
        icon: Legal,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "legal",
                    "\"legal aid\"",
                    "-\"coordinating bodies\"",
                    "-permits",
                    "-ceremonies",
                    "-making",
                    "-checks",
                    "-electoral",
                    "-taxation",
                    "-centrelink",
                    "-immigration",
                    "-\"hire of facilities\"",
                ],
            },
        },
        personalisation: [
            LegalSubcategories,
            LegalAreYouSafe,
            OnlineSafetyScreen,
            WhoIsLookingForHelpLegal,
            Location,
            DemographicsIndigenous,
        ],
    })),
    (new Category({
        name: "Drugs & alcohol",
        byline: "Support & assistance.",
        icon: Addiction,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "substance",
                    "abuse",
                    "-\"coordinating bodies\"",
                    "-\"registered training\"",
                ],
            },
            minimumShouldMatch: "30%",
        },
        personalisation: [
            AddictionSubcategories,
            WhoIsLookingForHelpDrugsAndAlcohol,
            Location,
            DemographicsIndigenous,
        ],
    })),
    (new Category({
        name: "Life skills & education",
        byline: "Everyday skills & training.",
        icon: Skills,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "life",
                    "skills",
                    "education",
                    "-\"coordinating bodies\"",
                    "-chsp",
                    "-hacc",
                ],
            },
        },
        personalisation: [
            LifeSkillsSubcategories,
            WhoIsLookingForHelpLifeSkills,
            Location,
            DemographicsIndigenous,
        ],
    })),
    (new Category({
        name: "Finding work",
        byline: "Earning & volunteering.",
        icon: Job,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "employment",
                    "-\"coordinating bodies\"",
                ],
                serviceTypes: ["Employment"],
            },
        },
        personalisation: [
            JobSubcategories,
            WhoIsLookingForHelpFindingWork,
            Location,
        ],
    })),
    (new Category({
        name: "Facilities",
        byline: "Toilets.",
        icon: Facilities,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "public",
                    "facilities",
                    "-\"coordinating bodies\"",
                    "-\"hire of facilities\"",
                    "-maintenance",
                ],
            },
        },
        personalisation: [
            WhoIsLookingForHelpFacilities,
            Location,
        ],
    })),
    (new Category({
        name: "Something to do",
        byline: "Libraries, Community Hubs etc.",
        icon: Entertainment,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "recreation",
                    "libraries",
                    "pools",
                    "-\"coordinating bodies\"",
                    "-physiology",
                    "-permit",
                    "-hire",
                    "-grants",
                    "-\"sports medicine\"",
                    "-\"sports physician\"",
                    "-\"sports psychology\"",
                ],
            },
        },
        personalisation: [
            WhoIsLookingForHelpSomethingToDo,
            Location,
        ],
    })),
    (new Category({
        name: "Technology",
        byline: "Wifi, charging etc.",
        icon: Tech,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "wifi",
                    "internet",
                    "computer",
                ],
            },
        },
        personalisation: [
            WhoIsLookingForHelpTechnology,
            Location,
        ],
    })),
    (new Category({
        name: "Advocacy",
        byline: "Complaints and advice.",
        icon: Advocacy,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "consumer",
                    "issues",
                    "mediation",
                    "discrimination",
                    "disputes advocacy",
                    "-research",
                    "-\"coordinating bodies\"",
                ],
            },
        },
        personalisation: [
            AdvocacySubcategories,
            WhoIsLookingForHelpAdvocacy,
            Location,
        ],
    })),
    (new Category({
        name: "Search",
        byline: "Free text search.",
        icon: <Search viewBox="14 14 35 35" />,
        searchQueryChanges(router: NextRouter) {
            const searchTerm = decodeURIComponent(String(router.query.search))

            const [isDAFSearch, DAFSearchTerm] = searchTerm.match(/^Disability Advocacy Providers(?: - )?(.*)/) || []

            // A special case for the "Find advocacy" button on the
            // DisabilityAdvocacyFinder page.
            if (isDAFSearch) {
                return {
                    term: [DAFSearchTerm || "disability"],
                    $push: {
                        serviceTypesRaw: "disability advocacy",
                    },
                }
            }

            return {
                $push: {
                    term: searchTerm,
                },
            }
        },
        personalisation: [
            FreeTextAreYouSafe,
            OnlineSafetyScreen,
            WhoIsLookingForHelpSearch,
            Location,
        ],
        dontShowInCategoryList: true,
    })),
];

export default categories;

// $FlowIgnore flowjs needs to be updated to include fromEntries
const categoryMap = Object.fromEntries(
    categories.map(category => [category.key, category]),
)

export function getCategory(key: string): Category | undefined {
    return categoryMap[key];
}
