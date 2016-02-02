/* @flow */

declare var GLOBAL: Object;

export default function loadVars() {

    if (!process.env.ISS_URL) {
        console.error("Must set ISS_URL");
        process.exit(1);
    }

    if (!process.env.GOOGLE_API_KEY) {
        console.warn("GOOGLE_API_KEY not set");
    }

    // On the client, we set these variables on `window`
    // Making them globals on the server means the same
    // code can be used.
    GLOBAL.ISS_URL = process.env.ISS_URL;
    GLOBAL.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    GLOBAL.SITE_DOMAIN = process.env.SITE_DOMAIN;
    GLOBAL.GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID;
    GLOBAL.GOOGLE_TAG_MANAGER_ID = process.env.GOOGLE_TAG_MANAGER_ID;

}
