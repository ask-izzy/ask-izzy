import { defineConfig } from "@playwright/test"
import { loadEnvConfig } from "@next/env"

loadEnvConfig(process.cwd())

const suites = [
    "personalisation",
    "category-queries",
    "features-1",
    "features-2",
    "maps",
]

export default defineConfig({
    testDir: "./test",
    // The tests share the mock ISS and CMS servers so can't run in parallel
    workers: 1,
    fullyParallel: false,
    forbidOnly: Boolean(process.env.CI),
    // Since pages are built on request when running the tests the first load
    // of a page may be very slow
    timeout: 3 * 60 * 1000,
    expect: {
        timeout: 10 * 1000,
    },
    // Screenshots and traces of failed tests are saved here and uploaded by CI
    outputDir: "testing-screenshots",
    reporter: process.env.CI ? [["list"], ["github"]] : "list",
    use: {
        viewport: {width: 1000, height: 1000},
        ignoreHTTPSErrors: true,
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
        launchOptions: {
            // Use the chromium installed in the docker image rather than one
            // downloaded by playwright
            executablePath: process.env.CHROMIUM_PATH ||
                (process.platform === "linux" ? "/usr/bin/chromium" : undefined),
            args: ["--no-sandbox", "--disable-dev-shm-usage"],
        },
    },
    projects: [
        ...suites.map(suite => ({
            name: suite,
            testMatch: `e2e/${suite}.spec.ts`,
        })),
        {
            name: "unit",
            testMatch: "unit/**/*.spec.ts",
        },
    ],
})
