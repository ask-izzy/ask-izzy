/* $FlowIgnore */
/*
 * Definitions for Geolocation related steps
 */

/* eslint-disable no-use-before-define */

import Yadda from "yadda";
import { titleize } from "underscore.string";
import _ from "underscore";
import Webdriver from "selenium-webdriver";
import { documentReady } from "./browser";
declare var IzzyStorage: Object;

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";
import { gotoUrl } from "../support/webdriver";

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given("I have (somewhere|nowhere) to sleep tonight",
            unpromisify(setSleepTonight))
        .given("I need nothing for $STRING",
            unpromisify(setSubcategoryItemsNone))
        .given("I need the following for $STRING\n$lines",
            unpromisify(setSubcategoryItems))
        .given("I need the following for $STRING: $STRING",
            unpromisify(setSubcategoryItem))
        .given("I am not looking for any specific housing",
            unpromisify(setHousingForWhoNone))
        .given("I am not part of any relevant demographics",
            unpromisify(setDemographicsNone))
        .given("I am not interested in any subcategory",
            unpromisify(setSubcategoriesNone))
        .given("I am part of the following demographics\n$lines",
            unpromisify(setDemographics))
        .given("I am looking for the following specific housing\n$lines",
            unpromisify(setHousingForWho))
        .given("my gender is $STRING", unpromisify(setGender))
        .given("I am 17 years old",
            unpromisify(_.partial(setAgeTo, "18 to 26")))
        .given("I am 27 years old",
            unpromisify(_.partial(setAgeTo, "26 to 64")))
        .given("I am 77 years old",
            unpromisify(_.partial(setAgeTo, "65 or older")))
        .when("I click on the done button",
            unpromisify(clickDoneButton))
    ;
})();

async function clickDoneButton(): Promise<void> {
    // Use JS for this because the element
    // is animated and seleniums click events miss
    await this.driver.executeScript(() => {
        document.querySelector(".done-button button").click()
    });

    await documentReady(this.driver);
}

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

async function setHousingForWho(
    items: Array<string>,
): Promise<void> {
    await gotoUrl(this.driver, "/"); // go anywhere to start the session
    await this.driver.executeScript(items => {
        IzzyStorage.setItem("housing-for-who", JSON.stringify(items));
    }, items);
}

function setDemographicsNone(): Promise<void> {
    return setDemographics.bind(this)([]);
}

function setHousingForWhoNone(): Promise<void> {
    return setHousingForWho.bind(this)([]);
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
