/* @flow */

// Performance impact isn't significant in tests
/* eslint-disable no-loop-func */

import Yadda from "yadda";
import _ from "underscore";
import { titleize } from "underscore.string";

import unpromisify from "../support/yadda-promise";
import dictionary from "../support/dictionary";
import storage from "../../src/storage";
import Categories from "../../src/constants/categories";
import Category from "../../src/constants/Category";
import {search} from "../../src/iss";
import type {searchResults} from "../../src/iss";
import Age from "../../src/pages/personalisation/Age";

async function deleteAnswers(): Promise<void> {
    storage.clear();
}

async function setLocation(location: string): Promise<void> {
    if (!location.match(/, /)) {
        throw new Error(
            "Location must have suburb & state separated by ', '."
        )
    }

    storage.setLocation(location);
    storage.setCoordinates(null);
}

async function setSleepTonight(answer: string): Promise<void> {
    if (answer === "somewhere") {
        answer = "Yes";
    } else if (answer === "nowhere") {
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
    storage.setItem("health-demographics", JSON.stringify(items));
}

function setDemographicsNone(): Promise<void> {
    return setDemographics.bind(this)([]);
}

async function setSubcategoryItem(
    category: string,
    item: string,
): Promise<void> {
    storage.setItem(
        `sub-${category.toLowerCase()}`,
        item
    );
}

async function setSubcategoriesNone(
    items: Array<string>,
): Promise<void> {
    storage.setItem("sub-addiction", "(skipped)");
    storage.setItem("sub-counselling", "(skipped)");
    storage.setItem("sub-everyday-things", "(skipped)");
    storage.setItem("sub-health", "(skipped)");
    storage.setItem("sub-housing", "(skipped)");
    storage.setItem("sub-indigenous", "(skipped)");
    storage.setItem("sub-job", "(skipped)");
    storage.setItem("sub-legal", "(skipped)");
    storage.setItem("sub-life-skills", "(skipped)");
    storage.setItem("sub-money", "(skipped)");
    storage.setItem("sub-technology", "(skipped)");
}

async function setSkipped(property: string): Promise<void> {
    storage.setItem(property, "(skipped)");
}

function ageBracket(age: number): string {
    const answers = Object.keys(Age.defaultProps.answers)
    const ages = answers.map((answer) => parseInt(answer.split(" ")[0]))

    for (let idx = ages.length; idx > 0; idx--) {
        if (age > ages[idx]) {
            return answers[idx]
        }
    }

    return answers[0];
}

async function setAge(age: number): Promise<void> {
    storage.setItem("age", ageBracket(age));
}

async function setAnswer(answer: string, attr: string): Promise<void> {
    storage.setItem(attr, answer);
}

async function setGender(gender: string): Promise<void> {
    storage.setItem("gender", titleize(gender));
}

// Shamelessly copied from ResultsPage
function issRequest({search, personalisation, name}: Category) {
    let request = search;

    const items = personalisation.filter( 
        item => (typeof item.showPage === "function") && item.showPage()
    )

    for (let item of items) {

        if (typeof item.getSearch === "function") {
            request = item.getSearch(request);

            if (!request) {
                throw new Error(
                    `Expected "${name}" to generate a query (missing ` +
                    `${item.name})`
                );
            }
        }
    }
    return request;
}

function objectMatches(expectation: any, subject: any): boolean {
    if (typeof expectation !== "object") {
        return expectation === subject;
    }

    for (const key of Object.keys(expectation)) {
        if (!objectMatches(expectation[key], subject[key])) {
            return false;
        }
    }

    return true;
}

async function searchIss(categoryName: string): Promise<searchResults> {
    const category = Categories.find(({key}) => key === categoryName)
    // $FlowIgnore
    const request = issRequest(category);

    return await search(Object.assign(request, {limit: 25}));
}

async function showResults(
    category: string
): Promise<void> {
    let services = (await searchIss(category)).objects;

    console.log(services.map(({id, name}) => `${id}: ${name}`))
}

async function skipResultsCheck(
    category: string,
    table: Array<Object>
): Promise<void> {
    // If a service appears near the end of the list
    // we don't have a good way to check for it
    // that doesn't cause spurious failures,
    // but we still want to capture it
    // in the tests.
}

async function assertNoSuchResults(
    category: string,
    table: Array<Object>
): Promise<void> {
    let services = (await searchIss(category)).objects.slice(0, 20);
    let errors = [];

    for (const banned of table) {
        services.forEach((service, index) => {
            if (objectMatches(banned, service)) {
                errors.push(`Expected ${
                    JSON.stringify(banned)
                } not be present, but found it in service ${
                    service.id
                } at position ${index}.`);
            }
        })
    }

    if (errors.length) {
        throw new Error(errors.join("\n"))
    }
}

async function assertResults(
    category: string,
    expectedResults: Array<Object>
): Promise<void> {
    let services = (await searchIss(category)).objects;
    let earlyServices = services.slice(0, 20)
    let found = expectedResults.filter(
        (requiredAttrs) =>
            earlyServices.find((service) =>
                objectMatches(requiredAttrs, service))
    )
    let missing = _.difference(expectedResults, found)

    if (missing.length > 0) {
        throw new Error(`Expected to find ${
            JSON.stringify(missing, null, 4)
        } results in the first 20 but they were absent. ${
            JSON.stringify(found.map(service => service.id), null, 4)
        } services did match. Results that did come back: ${
            JSON.stringify(services.map(({id, site}) =>
                `(${id}) ${site.name}`), null, 4)
        }`);
    }
}

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given("I have deleted all answers", unpromisify(deleteAnswers))
        .given("my location is \"$STRING\"", unpromisify(setLocation))
        .given("I have (somewhere|nowhere) to sleep tonight",
            unpromisify(setSleepTonight))
        .given("I am $NUMBER years old",
            unpromisify(setAge))
        .given("my gender is $STRING", unpromisify(setGender))
        .given("I have answered $STRING for $STRING", unpromisify(setAnswer))
        .given("I have skipped setting my $STRING",
            unpromisify(setSkipped))
        .given("I am not part of any relevant demographics",
            unpromisify(setDemographicsNone))
        .given("I am part of the following demographics\n$lines",
            unpromisify(setDemographics))
        .given("I am not interested in any subcategory",
            unpromisify(setSubcategoriesNone))
        .given("I need the following for $STRING: $string",
            unpromisify(setSubcategoryItem))
        .then("my results for $STRING should not contain\n$yaml",
            unpromisify(assertNoSuchResults))
        .then("my results for $STRING should contain\n$yaml",
            unpromisify(assertResults))
        .then("my results for $STRING would ideally contain\n$yaml",
            unpromisify(assertResults))
        .then("my results for $STRING would ideally not contain\n$yaml",
            unpromisify(assertNoSuchResults))
        .then("my results for $STRING has these services near the end\n$yaml",
            unpromisify(skipResultsCheck))
        .then("show my results for $STRING",
            unpromisify(showResults))

})();
