/* @flow */

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (process.env.NODE_ENV !== "test") {
    Sentry.init({
        dsn: SENTRY_DSN || "null",
        tracesSampleRate: 1.0,
        environment: process.env.ENVIRONMENT || process.env.NODE_ENV,
    });
}
