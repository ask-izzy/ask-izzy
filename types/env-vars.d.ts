// The existence of these is guaranteed by @/lib/env-var-check.js
declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_ISS_BASE_URL: string,
        NEXT_PUBLIC_ISS_API_TOKEN: string,
        LOCATIONS_API_BASE_URL: string,
        LOCATIONS_API_USERNAME: string,
        LOCATIONS_API_PASSWORD: string,
        NEXT_PUBLIC_NOTIFICATIONS_API_BASE_URL: string,
        NEXT_PUBLIC_NOTIFICATIONS_API_KEY: string,
        NEXT_PUBLIC_STRAPI_URL: string,
        NEXT_PUBLIC_SITE_EMAIL: string,
        SITE_PROTOCOL: string,
        SITE_DOMAIN: string,
        SITE_BASE_URL: string,
        RECAPTCHA_SECRET_KEY: string,
        NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string,
        NEXT_PUBLIC_SHARE_SERVICES_EMAIL_ENVIRONMENT: string,
        NEXT_PUBLIC_SHARE_SERVICES_EMAIL_PROVIDER: string,
        NEXT_PUBLIC_SHARE_SERVICES_EMAIL_TEMPLATE: string,
        NEXT_PUBLIC_PROXY_DOMAIN_SUFFIX?: string,
    }
}
