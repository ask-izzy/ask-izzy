/* @flow */

import Webdriver from "selenium-webdriver";
import ChromeWebDriver from "selenium-webdriver/chrome";

declare var IzzyStorage: Object;

export async function seleniumBrowser(
    driver: typeof Webdriver.WebDriver,
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

    return process.env.IZZY_TEST_URL || `http://localhost:${port}`;
}

/**
 * Visit the given URL on the running Express server.
 *
 * @param {Webdriver.Webdriver} driver - Selenium webdriver.
 * @param {string} url - URL to visit.
 *
 * @return {Promise} - return value from Selenium Webdriver.get.
 */
export function gotoUrl(
    driver: typeof Webdriver.WebDriver,
    url: string
): Promise<void> {
    return driver.get(baseUrl() + url);
}

/**
 * Build a webdriver.
 *
 * @return {Promise<Webdriver.Webdriver>} requested webdriver.
 */
export default async function webDriverInstance(
): Promise<typeof Webdriver.WebDriver> {
    // Remove version from browserName (not supported)
    const browserName = (process.env.SELENIUM_BROWSER || "").split(/:/)[0];
    const preferences = new Webdriver.logging.Preferences();

    preferences.setLevel(
        Webdriver.logging.Type.BROWSER,
        Webdriver.logging.Level.ALL
    );

    const driver = new Webdriver.Builder()
        /**
         * Default to using headless chrome if `SELENIUM_BROWSER` not provided.
         * */
        .withCapabilities(
            new Webdriver.Capabilities()
                .setAcceptInsecureCerts(true)
                .setLoggingPrefs(preferences)
        )
        .forBrowser(browserName || "chrome")
        .setChromeOptions(
            new ChromeWebDriver.Options().addArguments([
                "headless",
                "no-sandbox",
                "acceptInsecureCerts=true",
                "ignore-certificate-errors",
            ])
        )
        .build();

    await driver
        .manage()
        .setTimeouts({ implicit: 10000 });

    return driver;
}

async function waitForStorage(
    driver: typeof Webdriver.WebDriver,
): Promise<void> {
    await gotoUrl(driver, "/");
    await driver.wait(
        () => {
            return driver.executeScript(() =>
                typeof IzzyStorage != "undefined"
            )
        },
        10000
    );
}

export async function setStorage(
    driver: typeof Webdriver.WebDriver,
    value: string,
): Promise<void> {
    await waitForStorage(driver);
    await driver.executeScript((value) =>
        IzzyStorage.setItem(value), value
    )
}

export async function cleanDriverSession(
    driver: typeof Webdriver.WebDriver
): Promise<void> {
    await waitForStorage(driver);
    await driver.executeScript(() => {
        IzzyStorage.clear();
        window.dataLayer = [];
    });
}

export async function isElementPresent(
    driver: typeof Webdriver.WebDriver,
    locator: typeof Webdriver.By
): Promise<boolean> {
    const elements = await driver.findElements(locator);

    return elements.length > 0;
}
