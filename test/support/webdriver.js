
import Webdriver from 'selenium-webdriver';

export async function seleniumBrowser(driver) {
    var wnd = new Webdriver.WebDriver.Window(driver);
    var {width, height} = await wnd.getSize();
    var capabilities = await driver.getCapabilities();
    var res = capabilities.caps_;
    res.width = width;
    res.height = height;
    return res;
};

export function executeInFlow(fn, done) {
    Webdriver.promise.controlFlow().execute(fn).then(function() {
        done();
    }, done);
}

export default function webDriverInstance() {
    let branch = process.env.TRAVIS_BRANCH || "Manual";

    var driver = new Webdriver.Builder()
        /* These are used by Sauce Labs
         * You should also pass SELENIUM_REMOTE_URL to connect
         * via Selenium Grid */
        .withCapabilities({
            username: process.env.SAUCE_USERNAME,
            accessKey: process.env.SAUCE_ACCESS_KEY,
            name: "Ask Izzy " + branch,
            tags: [
                process.env.TRAVIS_PULL_REQUEST || "Manual",
                branch,
            ],
            build: process.env.TRAVIS_BUILD_NUMBER || "Manual",
            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
        })
        /* This is the default. Overridden by SELENIUM_BROWSER */
        .forBrowser('firefox')
        .build();

    driver.manage().timeouts().implicitlyWait(10000);
    return driver;
}
