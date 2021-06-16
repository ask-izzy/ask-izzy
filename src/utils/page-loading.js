/* @flow */
// Keep track of whether a page has fully loaded or not and notify subscribers
// when it is.

// Sometimes we want to do something after a page has finished fully loading
// including any data fetching need when loading that page. This allows
// components to registered load dep
import { Location } from "react-router-dom";

let currentLocation = {}
let currentDependencies = []
let currentSubscribers = []

export function addPageLoadDependencies(
    location: typeof Location,
    ...dependencies: string[]
) {
    if (location !== currentLocation) {
        currentLocation = location
        clearPageLoad()
    }

    for (const dependency of dependencies) {
        if (currentDependencies.includes(dependency)) {
            console.warn("Tried to add the same page load dependency twice")
            continue
        }
    }

    currentDependencies.push(...dependencies)
}

export function closePageLoadDependencies(
    location: typeof Location,
    ...dependencies: string[]
) {
    if (location !== currentLocation) {
        return
    }

    for (const dependency of dependencies) {
        const index = currentDependencies.indexOf(dependency)
        if (index < 0) {
            console.warn(
                "Tried to mark an unregistered page load dependency as closed"
            )
            continue
        }

        currentDependencies.splice(index, 1)
    }

    if (currentDependencies.length === 0) {
        pageLoaded()
    }
}

function pageLoaded() {
    for (const subscriber of currentSubscribers) {
        subscriber.resolve()
    }
    currentSubscribers = []
    clearPageLoad()
}

export async function waitTillPageLoaded() {
    return new Promise(
        (resolve, reject) => currentSubscribers.push({resolve, reject})
    )
}

function clearPageLoad() {
    for (const subscriber of currentSubscribers) {
        subscriber.reject()
    }
    currentDependencies = []
    currentSubscribers = []
}
