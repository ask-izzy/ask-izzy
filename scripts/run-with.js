#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

/*
 * A script to help ensure other services are started up before running a command.
 *
 * ./run-with.js <flags> <command to run after services have started>
 *
 * For example if you wanted to start the mock services then build the app you can
 * do so with:
 *    $ ./run-with.js --mocks build
 *
 * The following flags are available:
 *     --mock-iss: starts the mock iss service
 *     --mock-cms: starts the mock cms service
 *     --test-env: runs any services and main command with NODE_ENV set to "test"
 *     --dev: serves Ask Izzy using Next.js dev server
 *     --built: serves the pre-built copy of Ask Izzy with the Next.js start server
 */

const {spawnSync} = require("child_process");
const {loadEnvConfig} = require("@next/env")

/*::
type Service = {
    command: string,
    startupCheck: string,
}
*/

function getService(name, nodeEnv)/*: Service*/ {
    const appPort = nodeEnv === "test" ? "3000" : "8000"
    if (name === "mockIss") {
        const port = getLocalhostPortFromEnvVar("NEXT_PUBLIC_ISS_BASE_URL")
        return {
            command: `env PORT=${port} yarn mock-iss`,
            startupCheck: String(port),
        }
    } else if (name === "mockCms") {
        const port = getLocalhostPortFromEnvVar("NEXT_PUBLIC_STRAPI_URL")
        return {
            command: `env PORT=${port} yarn mock-cms`,
            startupCheck: `http-get://localhost:${port}/graphql?query=%7B__typename%7D`,
        }
    } else if (name === "built") {
        return {
            command: `yarn start -p ${appPort}`,
            startupCheck: appPort,
        }
    } else if (name === "dev") {
        return {
            command: `yarn dev -p ${appPort}`,
            startupCheck: appPort,
        }
    } else {
        throw Error(`Unknown service: ${name}`)
    }
}

const args = process.argv.slice(2)

let firstNonFlagIndex = args.findIndex(arg => !arg.startsWith("--"))
if (firstNonFlagIndex === -1) {
    firstNonFlagIndex = args.length
}

const flags = args.slice(0, firstNonFlagIndex)
const command = args.slice(firstNonFlagIndex)


const servicesToRunObj = {}
let nodeEnv

for (const flag of flags) {
    if (flag === "--mock-iss") {
        servicesToRunObj.mockIss = true
    } else if (flag === "--mock-cms") {
        servicesToRunObj.mockCms = true
    } else if (flag === "--mocks") {
        servicesToRunObj.mockIss = true
        servicesToRunObj.mockCms = true
    } else if (flag === "--dev") {
        servicesToRunObj.dev = true
    } else if (flag === "--built") {
        servicesToRunObj.built = true
    } else if (flag === "--test-env") {
        nodeEnv = "test"
    } else {
        throw Error(`Unknown flag: ${flag}`)
    }
}

if (servicesToRunObj.dev && servicesToRunObj.built) {
    throw Error("Trying to run both dev and built servers at once")
}

if (nodeEnv) {
    process.env.NODE_ENV = nodeEnv
    const projectDir = process.cwd()
    loadEnvConfig(projectDir)
}

const servicesToRun = Object.entries(servicesToRunObj)
    .filter(([, shouldRun]) => shouldRun)
    .map(([name]) => getService(name, nodeEnv))

if (!servicesToRun.length) {
    throw Error("Can't run ./run-with.js without any services to run with.")
}

const serviceStartupChecks = servicesToRun.map(service => service.startupCheck)

const serviceCommandsConcurrently = servicesToRun.length > 1 ?
    `concurrently ${servicesToRun.map(service => `'${service.command}'`).join(" ")}`
    : servicesToRun[0].command

const exitInfo = spawnSync("/usr/bin/npx", [
    "start-server-and-test",
    serviceCommandsConcurrently,
    serviceStartupChecks.join("|"),
    command.join(" "),
], {
    stdio: "inherit",
    env: {
        ...process.env,
        ...(nodeEnv ? {NODE_ENV: nodeEnv} : {}),
    },
})

if (exitInfo.status) {
    process.exit(exitInfo.status)
}

function getLocalhostPortFromEnvVar(envVar) {
    let port
    try {
        const url = new URL(process.env[envVar])
        if (url.hostname === "localhost") {
            port = url.port
        }
    } catch (error) {
        // We don't need to catch any errors
    }
    if (!port) {
        throw Error(
            `To start service the ${envVar} env var ` +
            "should be set to a localhost address with a port. Got: " +
            process.env[envVar]
        )
    }
    return port
}
