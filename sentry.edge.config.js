/* @flow */

import * as Sentry from "@sentry/nextjs";
import getConfig from 'next/config';

getConfig();

if (process.env.NODE_ENV !== "test") {
    Sentry.init({
        dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "null",
        // Importing the shared config triggers a bug in sentry which adds a 2 sec delay to page loads so we don't
    });
}
