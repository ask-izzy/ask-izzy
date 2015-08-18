import Webdriver from 'selenium-webdriver';

export async function seleniumBrowser(driver) {
    var wnd = new Webdriver.WebDriver.Window(driver);
    try {
        var {width, height} = await wnd.getSize();
    } catch (e) {
        // Width and height aren't supported on android
        width = 0;
        height = 0;
    }

    var capabilities = await driver.getCapabilities();
    var res = capabilities.caps_;
    res.version = res.version || res.platformVersion;
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
    let baseCaps = {
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        name: "Ask Izzy " + branch,
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
        var browser = process.env.SELENIUM_BROWSER.split(/:/, 3);
        var _;
        [_, baseCaps.platformVersion, baseCaps.platformName] = browser;

        baseCaps.emulator = true;
    }

    if (process.env.SELENIUM_ORIENTATION) {
        baseCaps.deviceOrientation = process.env.SELENIUM_ORIENTATION;
    }

    var driver = new Webdriver.Builder()
        /* These are used by Sauce Labs
         * You should also pass SELENIUM_REMOTE_URL to connect
         * via Selenium Grid */
        .withCapabilities(baseCaps)
        /* This is the default. Overridden by SELENIUM_BROWSER */
        .forBrowser('firefox')
        .build();

    driver.manage().timeouts().implicitlyWait(10000);
    return driver;
}
