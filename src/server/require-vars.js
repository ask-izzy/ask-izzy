/* @flow */

export default function requireVars() {
    if (!process.env.ISS_URL) {
        console.error("Must set ISS_URL");
        process.exit(1);
    }

    if (!process.env.GOOGLE_API_KEY) {
        console.warn("GOOGLE_API_KEY not set");
    }
}
