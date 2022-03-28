/* @flow */

export default function requireVars() {
    const requiredVars = [
        "ISS_BASE_URL",
        "ISS_VERSION",
        "LOCATIONS_API_BASE_URL",
        "GOOGLE_API_KEY",
    ]

    for (const requiredVar of requiredVars) {
        if (!process.env[requiredVar]) {
            console.error(`The ${requiredVar} env var must be set`)
            process.exit(1)
        }
    }
}
