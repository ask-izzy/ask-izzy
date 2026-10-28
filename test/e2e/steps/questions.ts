/*
 * Step definitions for setting answers to personalisation questions
 */

import Yadda from "yadda"

import dictionary from "../support/dictionary"
import { setStorageValue } from "../support/world"
import type { StepContext } from "../support/world"
import categories from "@/src/constants/categories"
import WhoIsLookingForHelpDFVPage from "@/src/constants/personalisation-pages/WhoIsLookingForHelpDFV"
import WhoIsLookingForHelpAdvocacyPage from "@/src/constants/personalisation-pages/WhoIsLookingForHelpAdvocacy"
import WhoIsLookingForHelpEverydayNeedsPage
    from "@/src/constants/personalisation-pages/WhoIsLookingForHelpEverydayNeeds"
import WhoIsLookingForHelpFindingWorkPage from "@/src/constants/personalisation-pages/WhoIsLookingForHelpFindingWork"
import WhoIsLookingForHelpFoodPage from "@/src/constants/personalisation-pages/WhoIsLookingForHelpFood"
import WhoIsLookingForHelpHealthPage from "@/src/constants/personalisation-pages/WhoIsLookingForHelpHealth"
import WhoIsLookingForHelpHousingPage from "@/src/constants/personalisation-pages/WhoIsLookingForHelpHousing"
import WhoIsLookingForHelpPage from "@/src/constants/personalisation-pages/WhoIsLookingForHelp"
import WhoIsLookingForHelpMoneyPage from "@/src/constants/personalisation-pages/WhoIsLookingForHelpMoney"
import WhoIsLookingForHelpSearchPage from "@/src/constants/personalisation-pages/WhoIsLookingForHelpSearch"
import WhoIsLookingForHelpSupportAndCounsellingPage
    from "@/src/constants/personalisation-pages/WhoIsLookingForHelpSupportAndCounselling"
import SleepTonightPage from "@/src/constants/personalisation-pages/SleepTonight"
import DemographicsPage from "@/src/constants/personalisation-pages/Demographics"
import DFVDemographicsPage from "@/src/constants/personalisation-pages/DfvDemographics"
import DemographicsIndigenousPage from "@/src/constants/personalisation-pages/DemographicsIndigenous"
import DemographicsAtsiCaldLgbtiqaPage from "@/src/constants/personalisation-pages/DemographicsAtsiCaldLgbtiqa"
import DemographicsAtsiCaldPage from "@/src/constants/personalisation-pages/DemographicsAtsiCald"
import GenderPage from "@/src/constants/personalisation-pages/Gender"
import AgePage from "@/src/constants/personalisation-pages/Age"
import AreYouSafePage from "@/src/constants/personalisation-pages/AreYouSafe"

// TODO: Question answers should be validated against what the actual answers
// for question pages are so to avoid ugly code duplication here but that's not
// really feasible until we refactor question pages so we can more easily pull
// valid question answers.

const whoIsLookingForHelpPages = [
    WhoIsLookingForHelpDFVPage,
    WhoIsLookingForHelpAdvocacyPage,
    WhoIsLookingForHelpEverydayNeedsPage,
    WhoIsLookingForHelpFindingWorkPage,
    WhoIsLookingForHelpFoodPage,
    WhoIsLookingForHelpHealthPage,
    WhoIsLookingForHelpHousingPage,
    WhoIsLookingForHelpPage,
    WhoIsLookingForHelpMoneyPage,
    WhoIsLookingForHelpSearchPage,
    WhoIsLookingForHelpSupportAndCounsellingPage,
]

export default Yadda.localisation.English.library(dictionary)
    .given("I have (somewhere|nowhere) to sleep tonight", async function(this: StepContext, answer: string) {
        await setStorageValue(
            this.world.page,
            SleepTonightPage.name,
            {somewhere: "Yes", nowhere: "No"}[answer]
        )
    })
    .given(
        "I am interested in the \"$STRING\" subcategory for $STRING",
        async function(this: StepContext, subcategory: string, category: string) {
            await setStorageValue(this.world.page, `${category}-subcategory`, subcategory)
        }
    )
    .given("I am not interested in a subcategory for $STRING", async function(this: StepContext, category: string) {
        await setStorageValue(this.world.page, `${category}-subcategory`, "(skipped)")
    })
    .given("I am not interested in any subcategory", async function(this: StepContext) {
        for (const category of categories) {
            await setStorageValue(this.world.page, `${category.key}-subcategory`, "(skipped)")
        }
    })
    .given(
        "I need help for (myself|a client or customer|a friend or family member)",
        async function(this: StepContext, answer: string) {
            const value = {
                "myself": "User Myself",
                "a client or customer": "User Worker",
                "a friend or family member": "User Someone Else",
            }[answer]
            for (const page of whoIsLookingForHelpPages) {
                await setStorageValue(this.world.page, page.name, value)
            }
        }
    )
    .given("I have not said who is looking for help with $STRING", async function(
        this: StepContext,
        categoryKey: string,
    ) {
        const pageName = `${WhoIsLookingForHelpPage.name}-${categoryKey}`
        await this.world.page.evaluate(
            pageName => window.IzzyStorage.removeItem(pageName),
            pageName,
        )
    })
    .given("I am not part of any relevant demographics", async function(this: StepContext) {
        const page = this.world.page
        await setStorageValue(page, DemographicsPage.name, JSON.stringify([]))
        await setStorageValue(page, DemographicsIndigenousPage.name, "(skipped)")
        await setStorageValue(page, DFVDemographicsPage.name, JSON.stringify([]))
        await setStorageValue(page, DemographicsAtsiCaldPage.name, JSON.stringify([]))
        await setStorageValue(page, DemographicsAtsiCaldLgbtiqaPage.name, JSON.stringify([]))
    })
    .given(
        "I am part of the following demographics\n$lines",
        async function(this: StepContext, items: Array<string>) {
            await setStorageValue(this.world.page, DemographicsPage.name, JSON.stringify(items))
        }
    )
    .given("my gender is (female|male|omitted)", async function(this: StepContext, gender: string) {
        await setStorageValue(
            this.world.page,
            GenderPage.name,
            {female: "Female", male: "Male", omitted: "(skipped)"}[gender]
        )
    })
    .given("I am (17|27|77) years old", setAgeTo)
    .given("I am (omitting my age)", setAgeTo)
    .given("I am safe at the moment", async function(this: StepContext) {
        await setStorageValue(this.world.page, AreYouSafePage.name, "Yes")
    })

async function setAgeTo(this: StepContext, age: string): Promise<void> {
    await setStorageValue(
        this.world.page,
        AgePage.name,
        {
            "17": "0 to 17",
            "27": "27 to 39",
            "77": "65 or older",
            "omitting my age": "(skipped)",
        }[age]
    )
}
