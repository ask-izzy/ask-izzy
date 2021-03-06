/* @flow */

import Webdriver from "selenium-webdriver";
import ChromeWebDriver from "selenium-webdriver/chrome";
import command from "selenium-webdriver/lib/command";

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
export async function gotoUrl(
    driver: typeof Webdriver.WebDriver,
    url: string
): Promise<void> {
    await driver.get(baseUrl() + url);
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

    driver.then(driver => {
        // This command is in an unreleased version of "selenium-webdriver"
        // (at the time of writing). After the next release this code can be
        // updated to use the command from the library directly.
        driver.getExecutor().defineCommand(
            "sendAndGetDevToolsCommand",
            "POST",
            "/session/:sessionId/chromium/send_command_and_get_result"
        );

        driver.executeScriptBeforeLoad = async(script, ...args) => {
            if (typeof script === "function") {
                script = `(${script}).apply(null, ${JSON.stringify(args)});`
            }
            return driver.getExecutor().execute(
                new command.Command("sendAndGetDevToolsCommand")
                    .setParameter(
                        "cmd",
                        "Page.addScriptToEvaluateOnNewDocument"
                    )
                    .setParameter("params", {"source": script})
                    .setParameter("sessionId",
                        (await driver.getSession()).getId()
                    )
            )
        }
        driver.removeScriptBeforeLoad = async scriptId =>
            driver.sendDevToolsCommand(
                "Page.removeScriptToEvaluateOnNewDocument",
                {"identifier": scriptId}
            )

        return driver
    })

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
    await driver.executeScript(() => console.log("Clearing browsing session"))
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
