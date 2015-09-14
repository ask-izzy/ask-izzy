/*
 * Definitions for Geolocation related steps
 */

/* @flow */

"use strict";

import Yadda from 'yadda';

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";
import { gotoUrl } from '../support/webdriver';

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given('I have (somewhere|nowhere) to sleep tonight',
               unpromisify(setSleepTonight))
        .given('I need nothing for $STRING',
               unpromisify(setSubcategoryItemsNone))
        .given('I need the following for $STRING\n$lines',
               unpromisify(setSubcategoryItems))
        ;
})();

async function setSleepTonight(answer: string): Promise<void> {
    if (answer == "somewhere") {
        answer = "Yes";
    } else if (answer == "nowhere") {
        answer = "No";
    } else {
        throw new Error("Unexpected");
    }

    await gotoUrl(this.driver, '/');  // go anywhere to start the session
    await this.driver.executeScript(answer => {
        sessionStorage.setItem("sleep-tonight", answer);
    }, answer);
}

async function setSubcategoryItems(category: string, items: Array<string>):
    Promise<void>
{
    await gotoUrl(this.driver, '/');  // go anywhere to start the session
    await this.driver.executeScript((category, items) => {
        sessionStorage.setItem(`sub-${category}`, JSON.stringify(items));
    }, category, items);
}

async function setSubcategoryItemsNone(category: string): Promise<void> {
    return setSubcategoryItems.bind(this)(category, []);
}
