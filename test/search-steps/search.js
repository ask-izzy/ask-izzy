/* @flow */

// Performance impact isn't significant in tests
/* eslint-disable no-loop-func */

import Yadda from "yadda";
import _ from "underscore";

import unpromisify from "../support/yadda-promise";
import dictionary from "../support/dictionary";
import storage from "../../src/storage";
import Categories from "../../src/constants/categories";
import {search, searchResults} from "../../src/iss";

async function deleteAnswers(): Promise<void> {
    storage.clear();
}

async function setLocation(location: string): Promise<void> {
    storage.setLocation(location);
    storage.setCoordinates(null);
}

async function setSleepTonight(answer: string): Promise<void> {
    if (answer == "somewhere") {
        answer = "Yes";
    } else if (answer == "nowhere") {
        answer = "No";
    } else {
        throw new Error(`Expected ${answer} to be Yes or No`);
    }

    storage.setItem("sleep-tonight", answer);
}

async function setDemographics(
    items: Array<string>,
): Promise<void> {
    storage.setItem("demographics", JSON.stringify(items));
}

function setDemographicsNone(): Promise<void> {
    return setDemographics.bind(this)([]);
}

async function setSubcategoriesNone(
    items: Array<string>,
): Promise<void> {
    storage.setItem("sub-addiction", "(skipped)");
    storage.setItem("sub-counselling", "(skipped)");
    storage.setItem("sub-everyday-things", "(skipped)");
    storage.setItem("sub-health", "(skipped)");
    storage.setItem("sub-housing", "(skipped)");
    storage.setItem("sub-job", "(skipped)");
    storage.setItem("sub-legal", "(skipped)");
    storage.setItem("sub-life-skills", "(skipped)");
    storage.setItem("sub-money", "(skipped)");
    storage.setItem("sub-technology", "(skipped)");
}

async function setAgeTo(age: string): Promise<void> {
    storage.setItem("age", age);
}

// Shamelessly copied from ResultsPage
function issRequest({search, personalisation}) {
    let request = search;

    for (let item of personalisation) {

        if (typeof item.getSearch == "function") {
            request = item.getSearch(request);

            if (!request) {
                return null;
            }
        }
    }
    return request;
}

function objectMatches(expectation: any, subject: any): boolean {
    if (typeof expectation != "object") {
        return expectation == subject;
    }

    for (const key of Object.keys(expectation)) {
        if (!objectMatches(expectation[key], subject[key])) {
            return false;
        }
    }

    return true;
}

async function searchIss(categoryName: string): Promise<searchResults> {
    const category = Categories.find(({key}) => key == "housing")
    const request = issRequest(category);

    if (!request) {
        throw new Error(`Expected ${
            category.name
        } to generate a query`);
    }

    return await search(request);
}

async function assertNoSuchResults(table: Array<Object>): Promise<void> {
    let services = (await searchIss("housing")).objects;

    for (const banned of table) {
        services.forEach((service, index) => {
            if (objectMatches(banned, service)) {
                throw new Error(`Expected ${
                    JSON.stringify(banned)
                } not be present, but found it in service ${
                    service.id
                }at position ${index}.`);
            }
        })
    }
}

async function assertResults(expectedResults: Array<Object>): Promise<void> {
    let services = (await searchIss("housing")).objects;

    let missing = expectedResults.filter(
        (requiredAttrs) =>
            !services.find((service) =>
                objectMatches(requiredAttrs, service))
    )

    if (missing.length > 0) {
        throw new Error(`Expected to find ${
            JSON.stringify(missing, null, 4)
        } results but they were absent.`);
    }
}

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given("I have deleted all answers", unpromisify(deleteAnswers))
        .given('my location is "$STRING"', unpromisify(setLocation))
        .given("I have (somewhere|nowhere) to sleep tonight",
               unpromisify(setSleepTonight))
        .given("I am 17 years old",
               unpromisify(_.partial(setAgeTo, "25 or younger")))
        .given("I am not part of any relevant demographics",
               unpromisify(setDemographicsNone))
        .given("I am not interested in any subcategory",
               unpromisify(setSubcategoriesNone))
        .then("my results for housing should not contain\n$yaml",
            unpromisify(assertNoSuchResults))
        .then("my results for housing should contain\n$yaml",
            unpromisify(assertResults))
})();
