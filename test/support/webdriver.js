/* @flow */

import Webdriver from "selenium-webdriver";

declare var IzzyStorage: Object;

export async function seleniumBrowser(
    driver: Webdriver.WebDriver,
): Promise<Object> {
    const wnd = new Webdriver.WebDriver.Window(driver);
    const capabilities = await driver.getCapabilities();
    const res = capabilities.caps_;

    res.version = res.version || res.platformVersion;

    try {
        const { width, height } = await wnd.getSize();

        res.width = width;
        res.height = height;
    } catch (error) {
        // Width and height aren't supported on android
        res.width = 0;
        res.height = 0;
    }

    return res;
}

/**
 * Gets the base URL for this session
 *
 * @return {string} - Root url for the application under test.
 */
export function baseUrl(): string {
    const port = process.env.PORT || 8000;

    return `http://localhost:${port}`;
}

/**
 * Visit the given URL on the running Express server.
 *
 * @param {Webdriver.Webdriver} driver - Selenium webdriver.
 * @param {string} url - URL to visit.
 *
 * @return {Promise} - return value from Selenium Webdriver.get.
 */
export function gotoUrl(driver: Webdriver.WebDriver, url: string): Promise {
    return driver.get(baseUrl() + url);
}

/**
 * Build a webdriver.
 *
 * @return {Promise<Webdriver.Webdriver>} requested webdriver.
 */
export default async function webDriverInstance(
): Promise<Webdriver.WebDriver> {
    const branch = process.env.TRAVIS_BRANCH || "Manual";
    const baseCaps: Webdriver.Capabilities = {
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        name: `Ask Izzy ${branch} ${process.env.TRAVIS_PULL_REQUEST || ""}`,
        tags: [
            process.env.TRAVIS_PULL_REQUEST || "Manual",
            branch,
        ],
        screenResolution: "1024x768",
        captureHtml: true,
        timeZone: "Melbourne",
        public: "public",
        build: process.env.TRAVIS_BUILD_NUMBER || "Manual",
        tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
    };

    if (process.env.SELENIUM_DEVICE) {
        baseCaps.appiumVersion = "1.4.10";
        baseCaps.deviceName = process.env.SELENIUM_DEVICE;

        // From selenium-webdriver - we need to
        // fill in some extra fields for appium
        const browser = (process.env.SELENIUM_BROWSER || "").split(/:/, 3);

        /* flow:disable unsupported by flow */
        [_, baseCaps.platformVersion, baseCaps.platformName] = browser;

        baseCaps.emulator = true;
    }

    if (process.env.SELENIUM_ORIENTATION) {
        baseCaps.deviceOrientation = process.env.SELENIUM_ORIENTATION;
    }

    const driver = new Webdriver.Builder()
        /* These are used by Sauce Labs
         * You should also pass SELENIUM_REMOTE_URL to connect
         * via Selenium Grid */
        .withCapabilities(baseCaps)
        /* This is the default. Overridden by SELENIUM_BROWSER */
        .forBrowser("firefox")
        .build();

    await driver
        .manage()
        .timeouts()
        .implicitlyWait(10000);

    return driver;
}

async function waitForStorage(
    driver: Webdriver.WebDriver,
): Promise<void> {
    await gotoUrl(driver, "/");
    await driver.wait(() =>
        driver.executeScript(() =>
            !!IzzyStorage
        ),
        10000
    );
}

export async function setStorage(
    driver: Webdriver.WebDriver,
    value: string,
): Promise<void> {
    await waitForStorage(driver);
    await driver.executeScript((value) =>
        IzzyStorage.setItem(value), value
    )
}

export async function cleanDriverSession(
    driver: Webdriver.WebDriver
): Promise<void> {
    await waitForStorage(driver);
    await driver.executeScript(() => {
        IzzyStorage.clear();
        window.dataLayer = [];
    });
}
