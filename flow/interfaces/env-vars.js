/* @flow */
// The existence of these is guaranteed by @/lib/env-var-check.js
declare class ProcessWithEnvVars extends Process {
    env: {
        NEXT_PUBLIC_ISS_BASE_URL: string,
        NEXT_PUBLIC_ISS_VERSION: string,
        NEXT_PUBLIC_ISS_API_KEY: string,
        NEXT_PUBLIC_PROXY_DOMAINS: string,
        NEXT_PUBLIC_STRAPI_URL: string,
        NEXT_PUBLIC_SITE_EMAIL: string,
        VERSION: string,
        [key: string] : string | void,
    },
}
declare var process: ProcessWithEnvVars

