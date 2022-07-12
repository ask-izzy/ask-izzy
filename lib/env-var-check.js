/* @flow */
// These should match what's listed in @/flow/interfaces/env-vars.js
const requiredVars/*: Array<$Keys<typeof process.env>> */ = [
    "NEXT_PUBLIC_ISS_BASE_URL",
    "NEXT_PUBLIC_ISS_VERSION",
    "NEXT_PUBLIC_ISS_API_KEY",
    "NEXT_PUBLIC_NOTIFICATIONS_API_BASE_URL",
    "NEXT_PUBLIC_NOTIFICATIONS_API_KEY",
    "NEXT_PUBLIC_PROXY_DOMAINS",
    "NEXT_PUBLIC_STRAPI_URL",
    "NEXT_PUBLIC_SITE_EMAIL",
    "SITE_PROTOCOL",
    "SITE_DOMAIN",
    "VERSION",
];

const missingEnvVars = requiredVars.filter(
    envVar => !(envVar in process.env)
)

// Sentry only accepts lowercase version
if (process.env.HTTP_PROXY && !process.env.http_proxy) {
    process.env.http_proxy = process.env.HTTP_PROXY
}

if (missingEnvVars.length) {
    console.info("NODE_ENV:", process.env.NODE_ENV)
    const multipleMissing = missingEnvVars.length > 1
    throw Error(
        `${multipleMissing ? "Several" : "A"} required environment variable ` +
            `has not been set: ${missingEnvVars.join(", ")}`
    )
}
