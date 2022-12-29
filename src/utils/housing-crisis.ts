import type {SearchQueryChanges} from "@/src/iss/searchQueryBuilder.js"

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
        catchment: "true",
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
