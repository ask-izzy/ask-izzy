/* @flow */

import * as Sentry from "@sentry/nextjs";
import getConfig from 'next/config';
import { CaptureConsole, ExtraErrorData } from "@sentry/integrations";

getConfig();

if (process.env.NODE_ENV !== "test") {
    Sentry.init({
        dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "null",
        ignoreErrors: [
            /is neither a category or a content page$/,
            /^Fast Refresh had to perform a full reload/,
        ],
    });
}
