/* $FlowIgnore */
/*
 * Definitions for Geolocation related steps
 */

/* eslint-disable no-use-before-define */

import Yadda from "yadda";
import { titleize } from "underscore.string";
import Webdriver from "selenium-webdriver";
declare var IzzyStorage: Object;

import dictionary from "../support/dictionary";
import { gotoUrl } from "../support/webdriver";

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given("I have (somewhere|nowhere) to sleep tonight", setSleepTonight)
        .given("I need nothing for $STRING", setSubcategoryItemsNone)
        .given("I need the following for $STRING\n$lines", setSubcategoryItems)
        .given("I need the following for $STRING: $STRING", setSubcategoryItem)
        .given("I am not part of any relevant demographics",
            setDemographicsNone
        )
        .given("I am not interested in any subcategory", setSubcategoriesNone)
        .given("I am part of the following demographics\n$lines",
            setDemographics
        )
        .given("my gender is $STRING", setGender)
        .given("I am 17 years old", function() {
            setAgeTo.call(this, "0 to 17")
        })
        .given("I am 27 years old", function() {
            setAgeTo.call(this, "27 to 39")
        })
        .given("I am 77 years old", function() {
            setAgeTo.call(this, "65 or older")
        })
})();

async function setSleepTonight(answer: string): Promise<void> {
    if (answer === "somewhere") {
        answer = "Yes";
    } else if (answer === "nowhere") {
        answer = "No";
    } else {
        throw new Error(`Expected ${answer} to be Yes or No`);
    }

    await gotoUrl(this.driver, "/"); // go anywhere to start the session
    await this.driver.executeScript(answer => {
        IzzyStorage.setItem("sleep-tonight", answer);
    }, answer);
}

async function setStorageValue(
    driver: Webdriver.WebDriver,
    key: string,
    value: string,
): Promise<void> {
    await gotoUrl(driver, "/"); // go anywhere to start the session
    await driver.executeScript((key, value) => {
        IzzyStorage.setItem(key, value);
    }, key, value);
}

async function setSubcategoryItems(
    category: string,
    items: Array<string>,
): Promise<void> {
    await setStorageValue(
        this.driver,
        `sub-${category}`,
        JSON.stringify(items)
    );
}

async function setSubcategoryItem(
    category: string,
    item: string,
): Promise<void> {
    await setStorageValue(
        this.driver,
        `sub-${category}`,
        item
    );
}

async function setSubcategoryItemsNone(category: string): Promise<void> {
    const key = `sub-${category}`;

    await setStorageValue(
        this.driver,
        key,
        (category === "housing") ? "(skipped)" : JSON.stringify([])
    );
}

async function setDemographics(
    items: Array<string>,
): Promise<void> {
    await gotoUrl(this.driver, "/"); // go anywhere to start the session
    await this.driver.executeScript(items => {
        IzzyStorage.setItem("demographics", JSON.stringify(items));
    }, items);
}

function setDemographicsNone(): Promise<void> {
    return setDemographics.bind(this)([]);
}

async function setSubcategoriesNone(
    items: Array<string>,
): Promise<void> {
    await gotoUrl(this.driver, "/"); // go anywhere to start the session
    await this.driver.executeScript(() => {
        IzzyStorage.setItem("sub-addiction", "(skipped)");
        IzzyStorage.setItem("sub-advocacy", "(skipped)");
        IzzyStorage.setItem("sub-counselling", "(skipped)");
        IzzyStorage.setItem("sub-everyday-things", "(skipped)");
        IzzyStorage.setItem("sub-food", "(skipped)");
        IzzyStorage.setItem("sub-health", "(skipped)");
        IzzyStorage.setItem("sub-housing", "(skipped)");
        IzzyStorage.setItem("sub-indigenous", "(skipped)");
        IzzyStorage.setItem("sub-job", "(skipped)");
        IzzyStorage.setItem("sub-legal", "(skipped)");
        IzzyStorage.setItem("sub-life-skills", "(skipped)");
        IzzyStorage.setItem("sub-money", "(skipped)");
        IzzyStorage.setItem("sub-technology", "(skipped)");
    });
}

async function setAgeTo(option: string): Promise<void> {
    await gotoUrl(this.driver, "/"); // go anywhere to start the session
    await this.driver.executeScript(age => {
        IzzyStorage.setItem("age", age);
    }, option);
}

async function setGender(gender: string): Promise<void> {
    await gotoUrl(this.driver, "/"); // go anywhere to start the session
    await this.driver.executeScript(gender => {
        IzzyStorage.setItem("gender", gender);
    }, titleize(gender));
}
