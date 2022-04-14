/* @flow */
// Needed purely to resolve circular dependencies issue
import "../src/utils/personalisation"
import personalisationPages from "../src/pages/personalisation";

import {getIssClient} from "../src/iss/client"
import type {ISS4ServiceType} from "../src/ix-web-js-client/apis/iss/v4"



if (typeof global?.window === "undefined") {
    global.window = process.env
}

if (typeof global?.fetch === "undefined") {
    global.fetch = require("node-fetch");
}

function getAllDeepKeyValues(
    objectToSearch: {[string]: any},
    key: string,
    deepSearchMatchingValues = false
): Array<any> {
    let returnValues = []
    if (typeof objectToSearch === "object") {
        if (key in objectToSearch) {
            returnValues = [objectToSearch[key]]
        }

        let objectToContinueSearching
        if (deepSearchMatchingValues) {
            const {[key]: keyValue, ...objectToSearchWithoutKey} =
                objectToSearch
            objectToContinueSearching = objectToSearchWithoutKey
        } else {
            objectToContinueSearching = objectToSearch
        }

        for (const nestedKey in objectToContinueSearching) {
            returnValues = [
                ...returnValues,
                ...getAllDeepKeyValues(objectToSearch[nestedKey], key),
            ]
        }
    }
    return returnValues
}

function getAllUsedServiceTypes() {
    const allUsedServiceTypes = new Set()

    for (const personalisationPage of Object.values(personalisationPages)) {
        const answers = personalisationPage.defaultProps?.possibleAnswers
        if (!answers) {
            continue;
        }
        const serviceTypes = getAllDeepKeyValues(answers, "serviceTypes").flat()
        for (const serviceType of serviceTypes) {
            allUsedServiceTypes.add(serviceType)
        }
    }

    return Array.from(allUsedServiceTypes)
}

async function validateServiceTypes() {
    const serviceTypesToValidate = getAllUsedServiceTypes()

    const issClient = getIssClient("4")

    const issServiceTypes = []
    let nextPageUrl = undefined
    while (nextPageUrl !== null) {
        const res = await issClient.getServiceTypes({nextPageUrl})
        issServiceTypes.push(...res.results)
        nextPageUrl = res.next
        // Throttle requests
        await new Promise(resolve => setTimeout(resolve, 300))
    }

    function flattenIssServiceTypes(issServiceTypes: Array<ISS4ServiceType>) {
        let serviceTypes = []
        for (const issServiceType of issServiceTypes) {
            serviceTypes.push(
                issServiceType.name,
                ...flattenIssServiceTypes(issServiceType.children)
            )
        }
        return serviceTypes
    }

    const serviceTypesInIss = new Set(
        flattenIssServiceTypes(issServiceTypes)
    )

    const invalidServiceTypes = serviceTypesToValidate
        .filter(serviceType => !serviceTypesInIss.has(serviceType))

    if (invalidServiceTypes.length) {
        console.error(
            `The following service types are invalid: ` +
                `${invalidServiceTypes.join(",")}`
        )
    } else {
        console.info("All service types are valid")
    }
}

validateServiceTypes()
