/* @flow */

export default function requireVars() {
    if (!process.env.ISS3_BASE_URL) {
        console.error("Must set ISS3_BASE_URL");
        process.exit(1);
    }

    if (!process.env.ISS3_API_KEY) {
        console.error("Must set ISS3_API_KEY");
        process.exit(1);
    }

    if (!process.env.GOOGLE_API_KEY) {
        console.warn("GOOGLE_API_KEY not set");
    }
}
