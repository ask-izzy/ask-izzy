/* @flow */
import React from "react"
import type { NextRouter } from "next/router";

import icons from "../icons";

import Category from "./Category";

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

const categories = [
    (new Category({
        name: "Food",
        byline: "Something to eat",
        icon: icons.Food,
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
                serviceTypes: ["Food"],
            },
        },
        personalisation: [
            FoodSubcategories,
            WhoIsLookingForHelpFood,
            Location,
        ],
    }): Category),
    (new Category({
        name: "Housing",
        byline: "A place to stay, housing issues",
        icon: icons.House,
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
    }): Category),
    (new Category({
        name: "Everyday needs",
        byline: "Clothes, showers, support and more",
        icon: icons.Things,
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
    }): Category),
    (new Category({
        name: "Money help",
        byline: "Centrelink, emergency funds, loans and more",
        icon: icons.Money,
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
                serviceTypes: ["Finance", "Financial Aid"],
            },
        },
        personalisation: [
            MoneySubcategories,
            WhoIsLookingForHelpMoney,
            Location,
        ],
    }): Category),
    (new Category({
        name: "Health",
        byline: "Doctors, clinics, specialists",
        icon: icons.Health,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "-\"coordinating bodies\"",
                    "assistance pets",
                    "-\"animal control\"",
                    "-effectiveness",
                ],
                serviceTypes: [
                    "Medical",
                    "Health Care Services",
                    "Health Professionals/ Practitioners",
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
    }): Category),
    (new Category({
        name: "Domestic and family violence help",
        byline:
            "Feeling unsafe, experiencing violence or abuse from a partner " +
            "or family member",
        icon: icons.EscapeViolence,
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
    }): Category),
    (new Category({
        name: "Advice and advocacy",
        byline: "Legal issues, fines, representation",
        icon: icons.Advocacy,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "advice",
                    "advocacy",
                    "-research",
                    "-\"coordinating bodies\"",
                ],
                serviceTypes: [
                    "Advocacy",
                    "Law",
                ],
            },
        },
        personalisation: [
            AdvocacySubcategories,
            WhoIsLookingForHelpAdvocacy,
            Location,
        ],
    }): Category),
    (new Category({
        name: "Work and learning",
        byline: "Jobs, education and skills",
        icon: icons.Job,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "employment",
                    "education",
                    "-\"coordinating bodies\"",
                    "-chsp",
                    "-hacc",
                ],
                serviceTypes: ["Employment", "Education"],
            },
        },
        personalisation: [
            JobSubcategories,
            WhoIsLookingForHelpFindingWork,
            Location,
        ],
    }): Category),
    (new Category({
        name: "Support & counselling",
        byline: "Mental health, relationships, addiction",
        icon: icons.Support,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: ["counselling"],
                serviceTypes: [
                    "Counselling",
                ],
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
    }): Category),
    (new Category({
        name: "Search",
        byline: "Free text search",
        icon: () => <icons.Search viewBox="14 14 35 35" />,
        searchQueryChanges(router: NextRouter) {
            const searchTerm = decodeURIComponent(router.query.search)

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
    }): Category),
];

export default categories;

// $FlowIgnore flowjs needs to be updated to include fromEntries
const categoryMap = Object.fromEntries(
    categories.map(category => [category.key, category])
)

export function getCategory(key: string): ?Category {
    return categoryMap[key];
}
