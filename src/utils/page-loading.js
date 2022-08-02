/* @flow */
// Keep track of whether a page has fully loaded or not and notify subscribers
// when it is.

// Sometimes we want to do something after a page has finished fully loading
// including any data fetching need when loading that page. This allows
// components to registered load dep
import {isDebugMode} from "../contexts/debug-mode-context";

let currentPagePath = {}
let currentDependencies = []
let currentSubscribers = []

export function addPageLoadDependencies(
    pagePath: string,
    ...dependencies: string[]
) {
    if (typeof window === "undefined") {
        return
    }

    if (pagePath !== currentPagePath) {
        currentPagePath = pagePath
        clearPageDependencies()
    }

    for (const dependency of dependencies) {
        if (currentDependencies.includes(dependency)) {
            console.warn(
                "Tried to add the same page load dependency twice: " +
                    dependency
            )
            continue
        }

        currentDependencies.push(dependency)

        if (isDebugMode()) {
            console.info(
                `Registering page dependency "${dependency}", there are ` +
                    `currently ${currentDependencies.length} dependencies ` + pagePath
            )
        }
    }
}

export function closePageLoadDependencies(
    pagePath: string,
    ...dependencies: string[]
) {
    if (typeof window === "undefined") {
        return
    }

    if (pagePath !== currentPagePath) {
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

        if (isDebugMode()) {
            console.info(
                `Closing page dependency "${dependency}", there are ` +
                    `currently ${currentDependencies.length} dependencies`
            )
        }
    }

    if (currentDependencies.length === 0) {
        pageLoaded()
    }
}

function pageLoaded() {
    if (isDebugMode()) {
        console.info(
            `Notifying ${currentSubscribers.length} subscribers of page load`
        )
    }
    for (const subscriber of currentSubscribers) {
        subscriber.resolve()
    }
    currentSubscribers = []
    clearPageDependencies()
}

export async function waitTillPageLoaded(): Promise<void> {
    if (currentDependencies.length > 0) {
        return new Promise(
            (resolve, reject) => currentSubscribers.push({resolve, reject})
        )
    }
}

// Attach waitTillPageLoaded to window so it is accessible when testing
if (typeof window !== "undefined") {
    window.waitTillPageLoaded = waitTillPageLoaded
}

function clearPageDependencies() {
    if (isDebugMode()) {
        console.info("Page dependencies cleared")
    }
    currentDependencies = []
}
