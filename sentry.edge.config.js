/* @flow */

import * as Sentry from "@sentry/nextjs";
import getConfig from 'next/config';

getConfig();

// Importing the shared sentry config init function triggers a bug in sentry which adds a 2 sec delay to page 
// loads so we don't use it
if (!process.env.NEXT_PUBLIC_IS_TEST_ENV) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "null",
    });
}
