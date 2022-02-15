/* @flow */

import type {SearchQueryChanges} from "../iss/searchQueryBuilder"

export const housingCrisisSearchQueryChanges: SearchQueryChanges = {
    $removeElms: {
        term: [
            "housing",
            "-\"respite care\"",
            "-\"housing information\"",
            "-hef",
        ],
    },
    $push: {
        term: "\"crisis accommodation\"",
    },
    $applyIfShouldInjectAccessPoints: {
        $removeElms: {
            term: ["\"crisis accommodation\""],
            serviceTypes: ["Housing"],
        },
        $push: {
            term: "\"Homelessness Access Point\"",
            serviceTypes: "Homelessness Access Point",
        },
    },
}
