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
}
