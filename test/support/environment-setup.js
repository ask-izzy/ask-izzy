/* @flow */

import { mapStackTrace } from "sourcemapped-stacktrace";

console.log("Modifying env for test")

window.isTestEnv = true

window.addEventListener("error", async(errorEvent) => {
    const error = await mapErrorStack(errorEvent.error)

    console.log("The above error translated:")
    console.error(error)
})

// Selenium doesn't read in output sent to info or warn
// $FlowIgnore
console.info = console.log
// $FlowIgnore
console.warn = console.log

// Selenium/Headless chrome doesn't yet support sourcemaps in error
// stack traces. This makes debugging failing tests a bit tricky since
// our prod source code is majorly transformed and minified. Until this
// is done natively use a third party lib to help apply the source map
// before showing the error.
async function mapErrorStack(error: Error) {
    return new Promise((resolve, reject) => {
        try {
            mapStackTrace(error.stack, (mappedStack) => {
                error.stack = [error.message, ...mappedStack].join("\n")
                resolve(error)
            })
        } catch (mapError) {
            reject(mapError)
        }

    })
}