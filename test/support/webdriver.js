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
    const port = process.env.PORT;

    if (!port) {
        throw Error("PORT env var not set")
    }

    return `http://localhost:${port}`;
}

/**
 * Visit the given URL on the running Express server.
 *
 * @param {Webdriver.Webdriver} driver - Selenium webdriver.
 * @param {string} url - URL to visit.
 * @param {any} mochaState - The state object provided by mocha.
 *
 * @return {Promise} - return value from Selenium Webdriver.get.
 */
export async function gotoUrl(
    driver: typeof Webdriver.WebDriver,
    url: string,
    mochaState: any
): Promise<void> {
    // Since we now build pages on request when running the tests the first load of a page
    // maybe very slow
    mochaState.slow(2 * 1000)
    mochaState.timeout(40 * 1000)
    await driver.get(baseUrl() + url);
}

/*
 * Build a webdriver.
 *
 * @return {Promise<Webdriver.Webdriver>} requested webdriver.
 */
export default async function webDriverInstance(): Promise<typeof Webdriver.WebDriver> {
    // Remove version from browserName (not supported)
    const browserName = (process.env.SELENIUM_BROWSER || "").split(/:/)[0];
    const preferences = new Webdriver.logging.Preferences();

    preferences.setLevel(
        Webdriver.logging.Type.BROWSER,
        Webdriver.logging.Level.ALL
    );

    const driver = await new Webdriver.Builder()
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
            new ChromeWebDriver.Options()
                .addArguments([
                    "headless",
                    "no-sandbox",
                    "acceptInsecureCerts=true",
                    "ignore-certificate-errors",
                    "disable-dev-shm-usage", // https://developers.google.com/web/tools/puppeteer/troubleshooting#running_on_alpine
                ])
                .windowSize(
                    {width: 1000, height: 1000}
                )
        )
        .build();

    await driver
        .manage()
        .setTimeouts({
            // Since we now build pages on request when running the tests the first load of a page
            // maybe very slow
            script: 40 * 1000,
            // When doing anything that requires an element to be in the dom if it's not found wait
            // up to 5 seconds before bailing
            implicit: 5 * 1000,
        });

    await driver

    // This command is in an unreleased version of "selenium-webdriver"
    // (at the time of writing). After the next release this code can be
    // updated to use the command from the library directly.
    driver.getExecutor().defineCommand(
        "sendAndGetDevToolsCommand",
        "POST",
        "/session/:sessionId/chromium/send_command_and_get_result"
    );

    driver.scriptIdsOfScriptsRunBeforeLoad = []

    driver.executeScriptBeforeLoad = async(script, ...args) => {
        if (typeof script === "function") {
            script = `(${script}).apply(null, ${JSON.stringify(args)});`
        }
        const scriptId = await driver.getExecutor().execute(
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
        driver.scriptIdsOfScriptsRunBeforeLoad.push(scriptId)
        return scriptId
    }
    driver.removeScriptBeforeLoad = async scriptId =>
        driver.sendDevToolsCommand(
            "Page.removeScriptToEvaluateOnNewDocument",
            scriptId
        )

    driver.removeAllScriptsBeforeLoad = async() => {
        while (driver.scriptIdsOfScriptsRunBeforeLoad.length) {
            const scriptId = driver.scriptIdsOfScriptsRunBeforeLoad.pop();
            await driver.removeScriptBeforeLoad(scriptId)
        }
    }

    return driver;
}

export async function cleanDriverSession(
    driver: typeof Webdriver.WebDriver,
    mochaState: any
): Promise<void> {
    await driver.executeScript(() => console.log("Clearing browsing session"))
    const url = await driver.getCurrentUrl()
    if (!url.includes("localhost")) {
        await gotoUrl(driver, "/404", mochaState)
    }
    // Wait for page to load and global storage object to be accessible
    await driver.wait(
        () => driver.executeScript(() => typeof IzzyStorage !== "undefined"),
        10000
    );
    await driver.removeAllScriptsBeforeLoad()

    await driver.executeScript(() => {
        IzzyStorage.clear();
        window.dataLayer = [];
        delete window.googleMocks
    });
}

export async function isElementPresent(
    driver: typeof Webdriver.WebDriver,
    locator: typeof Webdriver.By
): Promise<boolean> {
    const elements = await driver.findElements(locator);

    return elements.length > 0;
}
