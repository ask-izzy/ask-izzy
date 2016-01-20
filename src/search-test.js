/* @flow */
/*
 * Temporary code to aid in testing our search result quality
 */

import Categories from "../src/constants/categories";
import {search} from "../src/iss";
import _ from "underscore";
import storage from "../src/storage";

window.testLocations = {
    "Bungendore, NSW": [35.283755, 149.3764635],
    "Benalla, VIC": [-36.5707514, 145.866721],
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

// Return all answers this personalisation can result in
// Currently only selects a single demographic at a time
// as otherwise there are far too many (even for an automated test).
function answerPermutations(personalisation: Object): Array<Object> {
    const {name, answers} = personalisation.defaultProps;

    const toObject = (answer) => {
        let result = {};

        result[name] = answer;
        return result;
    }

    if (name == "location") {
        return [];
    }

    if (name == "demographics") {
        return Object.keys(answers)
            .concat([])
            .map((elem) => JSON.stringify(elem))
            .map(toObject);
    }

    return Object.keys(answers)
        .concat(["(skipped)"])
        .map(toObject);
}

function approxDistanceBetween(location, point): string {
    const [startLat, startLon] = window.testLocations[location];
    let distance = "unknown";

    if (point) {
        const {lat, lon} = point;

        // Approximation. Truncate to one decimal place.
        distance = `About ${Math.ceil(Math.sqrt(
            Math.pow(startLat - lat, 2) +
            Math.pow(startLon - lon, 2)
        ) * 400) / 10}km`;
    }

    return distance;
}

// Pretty-print a service
function formatTestResult(service, location): string {
    const {id, name} = service;
    let distance = approxDistanceBetween(
        location,
        service.Location().point
    )

    return `${name} (${id}) - approx ${distance} km away`
}

function addResultsToDom(objects, category, query): void {
    let row = document.createElement("pre");

    row.textContent = JSON.stringify({
        category: category.name,
        query: query,
        results: objects.map((service) =>
            formatTestResult(service, query.location)),
    }, null, 4);

    document
        .getElementById("secretContainer")
        .appendChild(row);
}

// Add all search results for the given category/location to the DOM
async function testCategoryAndLocation(category, location) {
    let categoryQueries = [{location}];
    const combineQueries = (answerObj) =>
        categoryQueries.map((query) =>
            Object.assign({}, query, answerObj)
        );

    for (const personalisation of category.personalisation) {
        const permutations = answerPermutations(personalisation);

        if (permutations.length > 0) {
            categoryQueries = _.flatten(
                permutations.map(combineQueries)
            );
        }
    }

    for (const query of categoryQueries) {
        storage.clear();
        for (let key of Object.keys(query)) {
            storage.setItem(key, query[key]);
        }

        let request = issRequest(category);

        if (!request) {
            throw new Error(`Expected ${
                category.name
            } to generate a query from ${
                JSON.stringify(query)
            }`);
        }
        let {objects} = await search(request);

        storage.clear();

        addResultsToDom(objects, category, query);
    }
}

// Housing is first in the list, but takes *forever*.
const reverseCategories = [...Categories].reverse()

async function startTest() {
    for (const location of Object.keys(window.testLocations)) {
        for (const category of reverseCategories) {
            await testCategoryAndLocation(category, location);
        }
    }
}

export default function testSearch() {
    startTest()
        .then(() => console.log("Tested all search permutations"))
        .catch((error) => console.log("Error running test search", error))
}

