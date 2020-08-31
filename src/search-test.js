/* @flow */
/*
 * Temporary code to aid in testing our search result quality
 */

import Categories from "../src/constants/categories";
import {search} from "../src/iss";
import _ from "underscore";
import storage from "../src/storage";

const browser = typeof window != "undefined";
let test = {search: {
    locations: {
        "Bungendore, NSW": [35.283755, 149.3764635],
        "Benalla, VIC": [-36.5707514, 145.866721],
    },
    // Housing is first in the list, but takes *forever*.
    categories: [...Categories].reverse(),
    demographicPermutations: [
        [],
        ["Escaping family violence"],
        ["Couples"],
        ["Parole / recently released"],
        ["Have pets"],
        [
            "Escaping family violence",
            "Aboriginal",
            "Family with children",
            "Parole / recently released",
            "Have a disability",
            "Have pets",
        ],
        [
            "Couples",
            "Family with children",
            "Person seeking asylum",
        ],
        [
            "Veteran",
            "Have a disability",
            "Have pets",
        ],
    ],
}};

// exposed so we can interactively fiddle with it in the console
if (browser) {
    window.test = test;
}

// Shamelessly copied from ResultsPage
function issRequest({search, personalisation}) {
    let request = search;

    for (let item of personalisation) {

        if (typeof item.getSearch === "function") {
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

    if (name === "location") {
        return [];
    }

    // Pick a single demographic at a time
    if (name === "demographics") {
        return test.search.demographicPermutations.map(toObject);
    }

    return Object.keys(answers)
        .concat(["(skipped)"])
        .map(toObject);
}

function approxDistanceBetween(location, point): string {
    const [startLat, startLon] = test.search.locations[location];
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
    const content = {
        category: category.name,
        query: query,
        results: objects.map((service) =>
            formatTestResult(service, query.location)),
    };

    if (browser) {
        let row = document.createElement("pre");

        row.textContent = JSON.stringify(content, null, 4);

        document
            .getElementById("secretContainer")
            // $FlowIgnore
            .appendChild(row);
    } else {
        console.log(content)
    }
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

async function startTest() {
    for (const location of Object.keys(test.search.locations)) {
        for (const category of test.search.categories) {
            await testCategoryAndLocation(category, location);
        }
    }
}

export default function testSearch() {
    startTest()
        .then(() => console.log("Tested all search permutations"))
        .catch((error) => console.log(
            "Error running test search",
            error,
            error.stack
        ))
}
