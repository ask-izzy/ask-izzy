/* @flow */

// Warning: the following is fairly ugly code. This file was written
// to be manually run during the process of reorganising the categories
// as a way to verify the service types used in all ISS queries actually
// exist in ISS.
// At some point it probably makes sense to move this into a CI step however
// as it doesn't seem like ISS3 supports checking fetching all service types
// so ISS4 as used. Since, at the time of writing, Ask Izzy hasn't switched
// over to using ISS4 yet it would be a bit of a pain to maintain creds for
// ISS3 and ISS4 to be used where ever the tests would be run (basically CI +
// local development) and the potential gain is fairly small. So for now
// let's leave it and as is and when Izzy moves to ISS4 we can consider
// cleaning this up and moving it into a CI step.

import type {
    PersonalisationPage,
} from "@/flow/personalisation-page"
/* eslint-disable max-len */
import AdvocacySubcategories from "@/src/constants/personalisation-pages/AdvocacySubcategories";
import Age from "@/src/constants/personalisation-pages/Age";
import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe";
import CounsellingAreYouSafe from "@/src/constants/personalisation-pages/CounsellingAreYouSafe";
import CounsellingSubcategories from "@/src/constants/personalisation-pages/CounsellingSubcategories";
import DemographicsIndigenous from "@/src/constants/personalisation-pages/DemographicsIndigenous";
import Demographics from "@/src/constants/personalisation-pages/Demographics";
import DfvDemographics from "@/src/constants/personalisation-pages/DfvDemographics";
import DFVSubcategories from "@/src/constants/personalisation-pages/DFVSubcategories";
import EverydayNeedsSubcategories from "@/src/constants/personalisation-pages/EverydayNeedsSubcategories";
import FoodSubcategories from "@/src/constants/personalisation-pages/FoodSubcategories";
import FreeTextAreYouSafe from "@/src/constants/personalisation-pages/FreeTextAreYouSafe";
import Gender from "@/src/constants/personalisation-pages/Gender";
import HealthSubcategories from "@/src/constants/personalisation-pages/HealthSubcategories";
import HousingSubcategories from "@/src/constants/personalisation-pages/HousingSubcategories";
import HousingAreYouSafe from "@/src/constants/personalisation-pages/HousingAreYouSafe";
import JobSubcategories from "@/src/constants/personalisation-pages/JobSubcategories";
import LgbtiqaDomesticViolenceScreen from "@/src/constants/personalisation-pages/LgbtiqaDomesticViolenceScreen";
import Location from "@/src/constants/personalisation-pages/Location";
import MoneySubcategories from "@/src/constants/personalisation-pages/MoneySubcategories";
import OnlineSafetyScreen from "@/src/constants/personalisation-pages/OnlineSafetyScreen";
import SleepTonight from "@/src/constants/personalisation-pages/SleepTonight";
import Under18DomesticViolenceScreen from "@/src/constants/personalisation-pages/Under18DomesticViolenceScreen";
import UsingViolenceScreen from "@/src/constants/personalisation-pages/UsingViolenceScreen";
import WhoIsLookingForHelpDFV from "@/src/constants/personalisation-pages/WhoIsLookingForHelpDFV";
import WhoIsLookingForHelpAdvocacy from "@/src/constants/personalisation-pages/WhoIsLookingForHelpAdvocacy";
import WhoIsLookingForHelpEverydayNeeds from "@/src/constants/personalisation-pages/WhoIsLookingForHelpEverydayNeeds";
import WhoIsLookingForHelpFindingWork from "@/src/constants/personalisation-pages/WhoIsLookingForHelpFindingWork";
import WhoIsLookingForHelpFood from "@/src/constants/personalisation-pages/WhoIsLookingForHelpFood";
import WhoIsLookingForHelpHealth from "@/src/constants/personalisation-pages/WhoIsLookingForHelpHealth";
import WhoIsLookingForHelpHousing from "@/src/constants/personalisation-pages/WhoIsLookingForHelpHousing";
import WhoIsLookingForHelpMoney from "@/src/constants/personalisation-pages/WhoIsLookingForHelpMoney";
import WhoIsLookingForHelpSearch from "@/src/constants/personalisation-pages/WhoIsLookingForHelpSearch";
import WhoIsLookingForHelpSupportAndCounselling from "@/src/constants/personalisation-pages/WhoIsLookingForHelpSupportAndCounselling";
/* eslint-enable max-len */

import createISSClient from "@/src/ix-web-js-client/apis/iss"
import type {ISS4ServiceType} from "../src/ix-web-js-client/apis/iss/v4"

import categories from "@/src/constants/categories"

const personalisationPages: Array<PersonalisationPage> = [
    AdvocacySubcategories,
    Age,
    AreYouSafe,
    CounsellingAreYouSafe,
    CounsellingSubcategories,
    DemographicsIndigenous,
    Demographics,
    DfvDemographics,
    DFVSubcategories,
    EverydayNeedsSubcategories,
    FoodSubcategories,
    FreeTextAreYouSafe,
    Gender,
    HealthSubcategories,
    HousingSubcategories,
    HousingAreYouSafe,
    JobSubcategories,
    LgbtiqaDomesticViolenceScreen,
    Location,
    MoneySubcategories,
    OnlineSafetyScreen,
    SleepTonight,
    Under18DomesticViolenceScreen,
    UsingViolenceScreen,
    WhoIsLookingForHelpDFV,
    WhoIsLookingForHelpAdvocacy,
    WhoIsLookingForHelpEverydayNeeds,
    WhoIsLookingForHelpFindingWork,
    WhoIsLookingForHelpFood,
    WhoIsLookingForHelpHealth,
    WhoIsLookingForHelpHousing,
    WhoIsLookingForHelpMoney,
    WhoIsLookingForHelpSearch,
    WhoIsLookingForHelpSupportAndCounselling,
]

if (typeof global?.window === "undefined") {
    global.window = process.env
}

if (typeof global?.fetch === "undefined") {
    global.fetch = require("node-fetch");
}

function getAllDeepKeyValues(
    objectToSearch: {[string]: any},
    key: string,
    deepSearchMatchingValues = false
): Array<any> {
    let returnValues = []
    if (typeof objectToSearch === "object") {
        if (key in objectToSearch) {
            returnValues = [objectToSearch[key]]
        }

        let objectToContinueSearching
        if (deepSearchMatchingValues) {
            const {[key]: keyValue, ...objectToSearchWithoutKey} =
                objectToSearch
            objectToContinueSearching = objectToSearchWithoutKey
        } else {
            objectToContinueSearching = objectToSearch
        }

        for (const nestedKey in objectToContinueSearching) {
            returnValues = [
                ...returnValues,
                ...getAllDeepKeyValues(objectToSearch[nestedKey], key),
            ]
        }
    }
    return returnValues
}

function getAllUsedServiceTypes() {
    const allUsedServiceTypes = new Set()

    for (const personalisationPage of personalisationPages) {
        if (personalisationPage.type === "question") {
            const answers = personalisationPage.possibleAnswers
            if (!answers) {
                continue;
            }
            const serviceTypes = [
                getAllDeepKeyValues(answers, "serviceTypes").flat(),
                getAllDeepKeyValues(answers, "serviceTypesRaw").flat(),
            ].flat()
            for (const serviceType of serviceTypes) {
                allUsedServiceTypes.add(serviceType)
            }
        }
    }

    for (const category of categories) {
        const {searchQueryChanges} = category
        if (typeof searchQueryChanges !== "object") {
            continue;
        }
        const serviceTypes = [
            getAllDeepKeyValues(searchQueryChanges, "serviceTypes").flat(),
            getAllDeepKeyValues(searchQueryChanges, "serviceTypesRaw").flat(),
        ].flat()
        for (const serviceType of serviceTypes) {
            allUsedServiceTypes.add(serviceType)
        }
    }

    return Array.from(allUsedServiceTypes)
}

async function validateServiceTypes() {
    const serviceTypesToValidate = getAllUsedServiceTypes()

    const ISS4ProdBaseUrl = process.env.ISS4_PROD_BASE_URL
    const ISS4ProdAPIToken = process.env.ISS4_PROD_API_TOKEN

    if (!ISS4ProdBaseUrl || !ISS4ProdAPIToken) {
        throw Error(`Please set ISS4_PROD_BASE_URL and ISS4_PROD_API_TOKEN`)
    }

    const issClient = await createISSClient(
        {
            baseUrl: ISS4ProdBaseUrl,
            token: ISS4ProdAPIToken,
        },
        "4"
    )

    const issServiceTypes = []
    let nextPageUrl = undefined
    while (nextPageUrl !== null) {
        const res = await issClient.getServiceTypes({nextPageUrl})
        issServiceTypes.push(...res.results)
        nextPageUrl = res.next
        // Throttle requests
        await new Promise(resolve => setTimeout(resolve, 300))
    }

    function flattenIssServiceTypes(issServiceTypes: Array<ISS4ServiceType>) {
        let serviceTypes = []
        for (const issServiceType of issServiceTypes) {
            serviceTypes.push(
                issServiceType.name,
                ...flattenIssServiceTypes(issServiceType.children)
            )
        }
        return serviceTypes
    }

    const serviceTypesInIss = new Set(
        flattenIssServiceTypes(issServiceTypes)
    )

    const invalidServiceTypes = serviceTypesToValidate
        .filter(serviceType => !serviceTypesInIss.has(serviceType))
    if (invalidServiceTypes.length) {
        console.error(
            `The following service types are invalid: ` +
                `${invalidServiceTypes.join(", ")}`
        )
    } else {
        console.info("All service types are valid")
    }
}

validateServiceTypes()
